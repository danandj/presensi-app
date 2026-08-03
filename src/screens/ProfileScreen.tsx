import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    useCallback,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    logout,
} from "../services/authService";

import {
    getCurrentUser,
} from "../storage/userStorage";

import type {
    User,
} from "../types/auth";

export default function ProfileScreen() {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const loadUser =
        useCallback(async (): Promise<void> => {
            try {
                setLoading(true);

                const currentUser =
                    await getCurrentUser();

                if (!currentUser) {
                    router.replace("/login");
                    return;
                }

                setUser(currentUser);
            } catch (error) {
                console.log(
                    "Gagal mengambil user:",
                    error,
                );

                Alert.alert(
                    "Terjadi kesalahan",
                    "Data pengguna tidak dapat dibaca.",
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [loadUser]),
    );

    const handleLogout = (): void => {
        Alert.alert(
            "Logout",
            "Apakah Anda yakin ingin keluar dari aplikasi?",
            [
                {
                    text: "Batal",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();

                            router.replace("/login");
                        } catch (error) {
                            console.log(
                                "Logout gagal:",
                                error,
                            );

                            Alert.alert(
                                "Logout gagal",
                                "Terjadi kesalahan saat keluar dari aplikasi.",
                            );
                        }
                    },
                },
            ],
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
                        Memuat profil...
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
                    Profile
                </Text>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Ionicons
                            name="person"
                            size={61}
                            color="#D8D8D8"
                        />
                    </View>

                    <View style={styles.onlineIndicator} />
                </View>

                <Text style={styles.username}>
                    {user?.username ?? "-"}
                </Text>

                <Text style={styles.fullName}>
                    {user?.nama_lengkap ?? "-"}
                </Text>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={23}
                        color="#FF554F"
                    />

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
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

    content: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 28,
    },

    avatarWrapper: {
        position: "relative",
    },

    avatar: {
        width: 98,
        height: 98,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#3F70FF",
        borderRadius: 49,
        backgroundColor: "#505050",
    },

    onlineIndicator: {
        position: "absolute",
        right: 3,
        bottom: 4,
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: "#0D121C",
        borderRadius: 8,
        backgroundColor: "#22C77A",
    },

    username: {
        marginTop: 19,
        color: "#FFFFFF",
        fontSize: 23,
        fontWeight: "700",
    },

    fullName: {
        marginTop: 7,
        color: "#949CAD",
        fontSize: 16,
    },

    logoutButton: {
        width: "100%",
        height: 54,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 33,
        borderWidth: 1,
        borderColor: "#FF554F",
        borderRadius: 10,
        backgroundColor: "#1C171C",
    },

    logoutText: {
        marginLeft: 10,
        color: "#FF554F",
        fontSize: 15,
        fontWeight: "700",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#929BAD",
        fontSize: 14,
    },
});