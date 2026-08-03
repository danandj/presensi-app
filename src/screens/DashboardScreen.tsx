import { Ionicons } from "@expo/vector-icons";
import {
    router,
} from "expo-router";

import { getCurrentUser } from "../storage/userStorage";
import type { User } from "../types/auth";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    getPresensiHariIni,
    getTotalPresensiBulanIni
} from "../services/presensiService";

import type { Presensi } from "../types/presensi";

import {
    useFocusEffect,
} from "@react-navigation/native";

interface DashboardParams {
    user_id?: string;
    username?: string;
    nama_lengkap?: string;
}

const TOTAL_HARI_KERJA = 20;

export default function DashboardScreen() {


    const [user, setUser] = useState<User | null>(null);
    const userId = user?.user_id ?? 0;

    const [waktu, setWaktu] = useState<Date>(
        new Date()
    );

    const [presensi, setPresensi] =
        useState<Presensi | null>(null);

    const [totalPresensi, setTotalPresensi] =
        useState<number>(0);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [refreshing, setRefreshing] =
        useState<boolean>(false);

    const [prosesPresensi, setProsesPresensi] =
        useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setWaktu(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const loadUser = async (): Promise<void> => {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            Alert.alert(
                "Session berakhir",
                "Silakan login kembali.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/login"),
                    },
                ]
            );

            return;
        }

        setUser(currentUser);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const loadDashboard = useCallback(
        async (): Promise<void> => {
            try {
                const currentUser =
                    await getCurrentUser();

                if (!currentUser) {
                    router.replace("/login");
                    return;
                }

                setUser(currentUser);

                const [
                    presensiHariIni,
                    jumlahPresensi,
                ] = await Promise.all([
                    getPresensiHariIni(
                        currentUser.user_id
                    ),
                    getTotalPresensiBulanIni(
                        currentUser.user_id
                    ),
                ]);

                setPresensi(presensiHariIni);
                setTotalPresensi(jumlahPresensi);
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat dashboard.";

                Alert.alert(
                    "Terjadi kesalahan",
                    message
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useFocusEffect(
        useCallback(() => {
            loadDashboard();
        }, [loadDashboard])
    );

    const handleRefresh = (): void => {
        setRefreshing(true);
        loadDashboard();
    };

    const handleCheckIn = (): void => {
        if (!userId) {
            Alert.alert(
                "Data pengguna tidak ditemukan",
                "Silakan login kembali.",
            );

            return;
        }

        router.push({
            pathname: "/presensi",
            params: {
                mode: "check-in",
            },
        });
    };

    const handleCheckOut = (): void => {
        if (!presensi?.jam_masuk) {
            Alert.alert(
                "Check-Out belum tersedia",
                "Anda harus check-in terlebih dahulu."
            );

            return;
        }

        router.push({
            pathname: "/presensi",
            params: {
                mode: "check-out",
            },
        });
    };

    const formatJam = (date: Date): string => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatTanggal = (
        date: Date
    ): string => {
        return date
            .toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            .toUpperCase();
    };

    const getStatusPresensi = (): string => {
        if (presensi?.jam_pulang) {
            return "Presensi hari ini selesai";
        }

        if (presensi?.jam_masuk) {
            return `Check-In ${presensi.jam_masuk.slice(
                0,
                5
            )}`;
        }

        return "Anda belum presensi";
    };

    const sudahCheckIn =
        Boolean(presensi?.jam_masuk);

    const sudahCheckOut =
        Boolean(presensi?.jam_pulang);

    const checkInAktif = !sudahCheckIn;

    const checkOutAktif =
        sudahCheckIn && !sudahCheckOut;

    const persentase =
        TOTAL_HARI_KERJA > 0
            ? Math.min(
                (totalPresensi /
                    TOTAL_HARI_KERJA) *
                100,
                100
            )
            : 0;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#3F70FF"
                    />

                    <Text style={styles.loadingText}>
                        Memuat dashboard...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#0D121C"
            />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#3F70FF"
                    />
                }
            >
                <View style={styles.header}>
                    <View style={styles.userSection}>
                        <View style={styles.avatar}>
                            <Ionicons
                                name="person"
                                size={23}
                                color="#3F70FF"
                            />
                        </View>

                        <View style={styles.userInfo}>
                            <Text
                                style={styles.namaLengkap}
                                numberOfLines={1}
                            >
                                {user?.nama_lengkap ?? "Pengguna"}
                            </Text>

                            <Text style={styles.tanggal}>
                                {formatTanggal(waktu)}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.infoButton}
                        activeOpacity={0.8}
                        onPress={() => router.push("/info")}
                    >
                        <Ionicons
                            name="information-circle"
                            size={26}
                            color="#9DA5B4"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.clockCard}>
                    <Text style={styles.clockText}>
                        {formatJam(waktu)}
                    </Text>

                    <View
                        style={[
                            styles.statusBadge,
                            sudahCheckOut &&
                            styles.statusBadgeSuccess,
                        ]}
                    >
                        <Ionicons
                            name={
                                sudahCheckOut
                                    ? "checkmark-circle"
                                    : "information-circle"
                            }
                            size={15}
                            color={
                                sudahCheckOut
                                    ? "#2DD881"
                                    : "#F5A000"
                            }
                        />

                        <Text
                            style={[
                                styles.statusText,
                                sudahCheckOut &&
                                styles.statusTextSuccess,
                            ]}
                        >
                            {getStatusPresensi()}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.presensiButton,
                            checkInAktif
                                ? styles.presensiButtonActive
                                : styles.presensiButtonInactive,
                        ]}
                        disabled={
                            !checkInAktif || prosesPresensi
                        }
                        activeOpacity={0.8}
                        onPress={handleCheckIn}
                    >
                        <View
                            style={[
                                styles.iconCircle,
                                checkInAktif &&
                                styles.iconCircleActive,
                            ]}
                        >
                            {prosesPresensi &&
                                checkInAktif ? (
                                <ActivityIndicator
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Ionicons
                                    name="log-in-outline"
                                    size={37}
                                    color={
                                        checkInAktif
                                            ? "#FFFFFF"
                                            : "#8C95A7"
                                    }
                                />
                            )}
                        </View>

                        <Text
                            style={[
                                styles.buttonText,
                                checkInAktif &&
                                styles.buttonTextActive,
                            ]}
                        >
                            Check-In
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSpace} />

                    <TouchableOpacity
                        style={[
                            styles.presensiButton,
                            checkOutAktif
                                ? styles.presensiButtonActive
                                : styles.presensiButtonInactive,
                        ]}
                        disabled={
                            !checkOutAktif || prosesPresensi
                        }
                        activeOpacity={0.8}
                        onPress={handleCheckOut}
                    >
                        <View
                            style={[
                                styles.iconCircle,
                                checkOutAktif &&
                                styles.iconCircleActive,
                            ]}
                        >
                            {prosesPresensi &&
                                checkOutAktif ? (
                                <ActivityIndicator
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Ionicons
                                    name="log-out-outline"
                                    size={37}
                                    color={
                                        checkOutAktif
                                            ? "#FFFFFF"
                                            : "#8C95A7"
                                    }
                                />
                            )}
                        </View>

                        <Text
                            style={[
                                styles.buttonText,
                                checkOutAktif &&
                                styles.buttonTextActive,
                            ]}
                        >
                            Check-Out
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>
                    STATISTIK PRESENSI
                </Text>

                <View style={styles.statisticCard}>
                    <View style={styles.statisticHeader}>
                        <View style={styles.statisticNumber}>
                            <Text style={styles.totalText}>
                                {totalPresensi}
                            </Text>

                            <Text style={styles.workDayTotal}>
                                / {TOTAL_HARI_KERJA}
                            </Text>
                        </View>

                        <Text style={styles.workDayText}>
                            Hari Kerja
                        </Text>
                    </View>

                    <Text style={styles.statisticDescription}>
                        Total Presensi Bulan Ini
                    </Text>

                    <View style={styles.progressContainer}>
                        <View
                            style={[
                                styles.progressValue,
                                {
                                    width: `${persentase}%`,
                                },
                            ]}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D121C",
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 19,
        paddingTop: 17,
        paddingBottom: 35,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#9BA4B5",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    userSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 47,
        height: 47,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: "#222B3B",
    },

    userInfo: {
        flex: 1,
        marginLeft: 15,
    },

    namaLengkap: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    tanggal: {
        marginTop: 5,
        color: "#979FAE",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    infoButton: {
        width: 47,
        height: 47,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
        backgroundColor: "#171D28",
    },

    clockCard: {
        alignItems: "center",
        marginTop: 29,
        paddingVertical: 29,
        borderRadius: 20,
        backgroundColor: "#171D28",
    },

    clockText: {
        color: "#FFFFFF",
        fontSize: 53,
        fontWeight: "700",
        letterSpacing: 1,
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
        paddingHorizontal: 15,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: "#805500",
        borderRadius: 20,
        backgroundColor: "#282013",
    },

    statusBadgeSuccess: {
        borderColor: "#176C48",
        backgroundColor: "#132B22",
    },

    statusText: {
        marginLeft: 7,
        color: "#F5A000",
        fontSize: 13,
        fontWeight: "600",
    },

    statusTextSuccess: {
        color: "#2DD881",
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 23,
    },

    presensiButton: {
        flex: 1,
        height: 154,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 19,
    },

    presensiButtonActive: {
        backgroundColor: "#3F70FF",
    },

    presensiButtonInactive: {
        backgroundColor: "#171D28",
    },

    buttonSpace: {
        width: 15,
    },

    iconCircle: {
        width: 61,
        height: 61,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 31,
        backgroundColor: "#252E3E",
    },

    iconCircleActive: {
        backgroundColor: "rgba(255,255,255,0.15)",
    },

    buttonText: {
        marginTop: 16,
        color: "#8F98AA",
        fontSize: 18,
        fontWeight: "700",
    },

    buttonTextActive: {
        color: "#FFFFFF",
    },

    sectionTitle: {
        marginTop: 34,
        marginBottom: 18,
        color: "#969EAE",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 0.8,
    },

    statisticCard: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 19,
        backgroundColor: "#171D28",
    },

    statisticHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    statisticNumber: {
        flexDirection: "row",
        alignItems: "flex-end",
    },

    totalText: {
        color: "#FFFFFF",
        fontSize: 31,
        fontWeight: "700",
    },

    workDayTotal: {
        marginBottom: 4,
        color: "#9199A9",
        fontSize: 14,
    },

    workDayText: {
        color: "#3F70FF",
        fontSize: 16,
        fontWeight: "700",
    },

    statisticDescription: {
        marginTop: 7,
        color: "#939CAD",
        fontSize: 14,
    },

    progressContainer: {
        height: 7,
        marginTop: 20,
        overflow: "hidden",
        borderRadius: 4,
        backgroundColor: "#273146",
    },

    progressValue: {
        height: "100%",
        minWidth: 4,
        borderRadius: 4,
        backgroundColor: "#3F70FF",
    },
});