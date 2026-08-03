import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface InformationCardProps {
    title: string;
    description: string;
}

function InformationCard({
    title,
    description,
}: InformationCardProps) {
    return (
        <View style={styles.informationCard}>
            <View style={styles.cardTitleContainer}>
                <Ionicons
                    name="information-circle"
                    size={18}
                    color="#3F70FF"
                />

                <Text style={styles.cardTitle}>
                    {title}
                </Text>
            </View>

            <Text style={styles.cardDescription}>
                {description}
            </Text>
        </View>
    );
}

export default function InfoScreen() {
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
                    Informasi Aplikasi
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.appIconContainer}>
                    <Ionicons
                        name="information-circle"
                        size={58}
                        color="#3F70FF"
                    />
                </View>

                <Text style={styles.appName}>
                    HadirQu
                </Text>

                <Text style={styles.versionText}>
                    v1.0.0 • Release
                </Text>

                <InformationCard
                    title="Tentang Aplikasi"
                    description="HadirQu adalah aplikasi kehadiran yang dirancang untuk memudahkan proses pencatatan kehadiran karyawan dan siswa. Aplikasi ini menyediakan fitur check-in dan check-out real-time dengan integrasi lokasi GPS untuk memastikan akurasi data kehadiran."
                />

                <InformationCard
                    title="Developer"
                    description="Aplikasi ini dikembangkan oleh mahasiswa STT Indonesia Tanjungpinang sebagai proyek akademik untuk meningkatkan keterampilan dalam pengembangan aplikasi mobile modern dengan teknologi Android dan Kotlin."
                />

                <Text style={styles.technicalTitle}>
                    Informasi Teknis
                </Text>

                <View style={styles.footerCard}>
                    <Text style={styles.copyrightText}>
                        © 2026 STT Indonesia Tanjungpinang
                    </Text>

                    <Text style={styles.rightsText}>
                        All Rights Reserved
                    </Text>
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
        paddingHorizontal: 15,
        paddingBottom: 35,
    },

    appIconContainer: {
        width: 77,
        height: 77,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 27,
        borderRadius: 16,
        backgroundColor: "#1F2B4A",
    },

    appName: {
        marginTop: 20,
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "700",
        textAlign: "center",
    },

    versionText: {
        marginTop: 7,
        color: "#8D96A7",
        fontSize: 12,
        textAlign: "center",
    },

    informationCard: {
        marginTop: 31,
        paddingHorizontal: 15,
        paddingTop: 17,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: "#2A3548",
        borderRadius: 13,
        backgroundColor: "#1B2433",
    },

    cardTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    cardTitle: {
        marginLeft: 8,
        color: "#3F70FF",
        fontSize: 14,
        fontWeight: "700",
    },

    cardDescription: {
        marginTop: 15,
        color: "#9AA3B3",
        fontSize: 14,
        lineHeight: 20,
        textAlign: "justify",
    },

    technicalTitle: {
        marginTop: 29,
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    footerCard: {
        alignItems: "center",
        marginTop: 25,
        paddingVertical: 20,
        borderRadius: 13,
        backgroundColor: "#1F2B4A",
    },

    copyrightText: {
        color: "#9AA3B3",
        fontSize: 12,
    },

    rightsText: {
        marginTop: 14,
        color: "#9AA3B3",
        fontSize: 12,
    },
});