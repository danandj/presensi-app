import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { getRiwayatPresensi } from "../services/presensiService";
import { getCurrentUser } from "../storage/userStorage";
import type { Presensi } from "../types/presensi";

interface HistoryParams {
    user_id?: string;
}

interface DateInformation {
    shortDay: string;
    dayNumber: string;
    fullDate: string;
}

export default function HistoryScreen() {

    const [dataPresensi, setDataPresensi] = useState<Presensi[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const loadHistory =
        useCallback(async (): Promise<void> => {
            try {
                const user = await getCurrentUser();

                if (!user) {
                    router.replace("/login");
                    return;
                }

                const result =
                    await getRiwayatPresensi(
                        user.user_id
                    );

                setDataPresensi(result);
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Gagal mengambil riwayat presensi.";

                Alert.alert(
                    "Terjadi kesalahan",
                    message
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }, []);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory]),
    );

    const handleRefresh = (): void => {
        setRefreshing(true);
        loadHistory();
    };

    const getDateInformation = (tanggal: string): DateInformation => {
        const date = new Date(`${tanggal}T00:00:00`);

        const shortDay = date
            .toLocaleDateString("id-ID", {
                weekday: "short",
            })
            .replace(".", "")
            .toUpperCase();

        const dayNumber = date.getDate().toString();

        const fullDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });

        return {
            shortDay,
            dayNumber,
            fullDate,
        };
    };

    const formatTime = (time: string | null): string => {
        if (!time) {
            return "-";
        }

        /*
         * Data time Supabase biasanya:
         * 20:32:17 atau 20:32:17.000000
         */
        return time.substring(0, 8);
    };

    const isHadir = (item: Presensi): boolean => {
        return Boolean(item.jam_masuk && item.jam_pulang);
    };

    const getStatusText = (item: Presensi): string => {
        if (item.jam_masuk && item.jam_pulang) {
            return "Hadir";
        }

        if (item.jam_masuk && !item.jam_pulang) {
            return "Belum Pulang";
        }

        return "Tidak Hadir";
    };

    const getStatusStyle = (item: Presensi) => {
        if (item.jam_masuk && item.jam_pulang) {
            return {
                container: styles.statusHadir,
                text: styles.statusTextHadir,
            };
        }

        if (item.jam_masuk && !item.jam_pulang) {
            return {
                container: styles.statusPending,
                text: styles.statusTextPending,
            };
        }

        return {
            container: styles.statusTidakHadir,
            text: styles.statusTextTidakHadir,
        };
    };

    const renderItem = ({ item }: { item: Presensi }) => {
        const dateInfo = getDateInformation(item.tanggal);
        const statusStyle = getStatusStyle(item);

        return (
            <View style={styles.historyItem}>
                <View style={styles.dateBox}>
                    <Text style={styles.shortDay}>
                        {dateInfo.shortDay}
                    </Text>

                    <Text style={styles.dayNumber}>
                        {dateInfo.dayNumber}
                    </Text>
                </View>

                <View style={styles.historyInformation}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.fullDate}>
                            {dateInfo.fullDate}
                        </Text>

                        <View
                            style={[
                                styles.statusBadge,
                                statusStyle.container,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    statusStyle.text,
                                ]}
                            >
                                {getStatusText(item)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timeContainer}>
                        <View style={styles.timeItem}>
                            <Ionicons
                                name="log-in-outline"
                                size={18}
                                color="#7F899C"
                            />

                            <Text style={styles.timeText}>
                                {formatTime(item.jam_masuk)}
                            </Text>
                        </View>

                        <View style={styles.timeItem}>
                            <Ionicons
                                name="log-out-outline"
                                size={18}
                                color="#7F899C"
                            />

                            <Text style={styles.timeText}>
                                {formatTime(item.jam_pulang)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#0D121C"
                />

                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#3F70FF"
                    />

                    <Text style={styles.loadingText}>
                        Memuat riwayat presensi...
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

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    History Presensi
                </Text>
            </View>

            <FlatList
                data={dataPresensi}
                keyExtractor={(item) =>
                    item.presensi_id.toString()
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    dataPresensi.length === 0 &&
                    styles.emptyListContent,
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#3F70FF"
                        colors={["#3F70FF"]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="calendar-outline"
                                size={48}
                                color="#667085"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Belum Ada Riwayat
                        </Text>

                        <Text style={styles.emptyDescription}>
                            Data presensi Anda akan ditampilkan di halaman ini.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D121C",
    },

    header: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        backgroundColor: "#0D121C",
    },

    backButton: {
        width: 35,
        height: 45,
        justifyContent: "center",
    },

    headerTitle: {
        marginLeft: 5,
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    listContent: {
        paddingBottom: 30,
    },

    emptyListContent: {
        flexGrow: 1,
    },

    historyItem: {
        minHeight: 99,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#273041",
    },

    dateBox: {
        width: 57,
        height: 67,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 11,
        backgroundColor: "#1E2A4A",
    },

    shortDay: {
        color: "#3F70FF",
        fontSize: 12,
        fontWeight: "700",
    },

    dayNumber: {
        marginTop: 6,
        color: "#3F70FF",
        fontSize: 21,
        fontWeight: "700",
    },

    historyInformation: {
        flex: 1,
        marginLeft: 16,
    },

    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    fullDate: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    statusBadge: {
        marginLeft: 10,
        paddingHorizontal: 9,
        paddingVertical: 8,
        borderRadius: 6,
    },

    statusHadir: {
        backgroundColor: "#112D25",
    },

    statusTidakHadir: {
        backgroundColor: "#351B24",
    },

    statusPending: {
        backgroundColor: "#332914",
    },

    statusText: {
        fontSize: 10,
        fontWeight: "700",
    },

    statusTextHadir: {
        color: "#38B878",
    },

    statusTextTidakHadir: {
        color: "#FF555E",
    },

    statusTextPending: {
        color: "#F5A000",
    },

    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 13,
    },

    timeItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 18,
    },

    timeText: {
        marginLeft: 5,
        color: "#8B95A7",
        fontSize: 14,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#8F98AA",
        fontSize: 14,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35,
    },

    emptyIcon: {
        width: 85,
        height: 85,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 43,
        backgroundColor: "#171D28",
    },

    emptyTitle: {
        marginTop: 20,
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    emptyDescription: {
        marginTop: 8,
        color: "#8F98AA",
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
    },
});