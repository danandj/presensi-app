import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    useEffect,
    useRef,
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

import MapView, {
    Marker,
    Polygon,
    PROVIDER_GOOGLE,
    Region,
} from "react-native-maps";

import {
    checkIn,
    checkOut,
} from "../services/presensiService";

import { getCurrentUser } from "../storage/userStorage";

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface PresensiParams {
    mode?: string;
}

const AREA_PRESENSI: Coordinate[] = [
    {
        latitude: 0.9210373151913888,
        longitude: 104.45395050618669,
    },
    {
        latitude: 0.9210389098363181,
        longitude: 104.45381653870712,
    },
    {
        latitude: 0.9208499444068389,
        longitude: 104.45380856445237,
    },
    {
        latitude: 0.9208451604717838,
        longitude: 104.45410121960121,
    },
    {
        latitude: 0.9209464204290569,
        longitude: 104.4541020170267,
    },
    {
        latitude: 0.9209591775888094,
        longitude: 104.45394253193196,
    },
];

const INITIAL_REGION: Region = {
    latitude: 0.92094,
    longitude: 104.45395,
    latitudeDelta: 0.0008,
    longitudeDelta: 0.0008,
};

export default function PresensiScreen() {
    const params =
        useLocalSearchParams<PresensiParams>();

    const mapRef = useRef<MapView | null>(null);

    const mode: "check-in" | "check-out" =
        params.mode === "check-out"
            ? "check-out"
            : "check-in";

    const [currentLocation, setCurrentLocation] =
        useState<Coordinate | null>(null);

    const [accuracy, setAccuracy] =
        useState<number | null>(null);

    const [isInsideArea, setIsInsideArea] =
        useState<boolean>(false);

    const [loadingLocation, setLoadingLocation] =
        useState<boolean>(true);

    const [processing, setProcessing] =
        useState<boolean>(false);

    const [currentTime, setCurrentTime] =
        useState<Date>(new Date());

    useEffect(() => {
        getCurrentLocation();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    /**
     * Memeriksa apakah sebuah titik berada
     * di dalam polygon menggunakan ray casting.
     */
    const isPointInsidePolygon = (
        point: Coordinate,
        polygon: Coordinate[],
    ): boolean => {
        const x = point.longitude;
        const y = point.latitude;

        let inside = false;

        for (
            let i = 0, j = polygon.length - 1;
            i < polygon.length;
            j = i++
        ) {
            const xi = polygon[i].longitude;
            const yi = polygon[i].latitude;

            const xj = polygon[j].longitude;
            const yj = polygon[j].latitude;

            const intersects =
                yi > y !== yj > y &&
                x <
                ((xj - xi) * (y - yi)) /
                (yj - yi) +
                xi;

            if (intersects) {
                inside = !inside;
            }
        }

        return inside;
    };

    const getCurrentLocation =
        async (): Promise<void> => {
            try {
                setLoadingLocation(true);

                const permission =
                    await Location.requestForegroundPermissionsAsync();

                if (permission.status !== "granted") {
                    Alert.alert(
                        "Izin lokasi diperlukan",
                        "Aktifkan izin lokasi agar aplikasi dapat memeriksa posisi presensi.",
                        [
                            {
                                text: "Kembali",
                                onPress: () => router.back(),
                            },
                        ],
                    );

                    return;
                }

                const location =
                    await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });

                const position: Coordinate = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                };

                const insideArea =
                    isPointInsidePolygon(
                        position,
                        AREA_PRESENSI,
                    );

                setCurrentLocation(position);
                setAccuracy(
                    location.coords.accuracy ?? null,
                );
                setIsInsideArea(insideArea);

                mapRef.current?.animateToRegion(
                    {
                        latitude: position.latitude,
                        longitude: position.longitude,
                        latitudeDelta: 0.0008,
                        longitudeDelta: 0.0008,
                    },
                    700,
                );
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Tidak dapat mengambil lokasi.";

                Alert.alert(
                    "Lokasi gagal diperoleh",
                    message,
                );
            } finally {
                setLoadingLocation(false);
            }
        };

    const handlePresensi =
        async (): Promise<void> => {
            if (processing) {
                return;
            }

            const user = await getCurrentUser();

            if (!user) {
                Alert.alert(
                    "Session berakhir",
                    "Silakan login kembali.",
                    [
                        {
                            text: "OK",
                            onPress: () =>
                                router.replace("/login"),
                        },
                    ]
                );

                return;
            }

            if (!currentLocation) {
                Alert.alert(
                    "Lokasi belum tersedia",
                    "Silakan ambil posisi terlebih dahulu."
                );

                return;
            }

            const insideArea =
                isPointInsidePolygon(
                    currentLocation,
                    AREA_PRESENSI
                );

            if (!insideArea) {
                Alert.alert(
                    "Presensi gagal",
                    "Posisi Anda berada di luar area presensi."
                );

                return;
            }

            try {
                setProcessing(true);

                if (mode === "check-in") {
                    await checkIn(user.user_id);

                    Alert.alert(
                        "Presensi berhasil",
                        "Presensi masuk berhasil disimpan.",
                        [
                            {
                                text: "OK",
                                onPress: () => router.back(),
                            },
                        ]
                    );
                } else {
                    await checkOut(user.user_id);

                    Alert.alert(
                        "Presensi berhasil",
                        "Presensi pulang berhasil disimpan.",
                        [
                            {
                                text: "OK",
                                onPress: () => router.back(),
                            },
                        ]
                    );
                }
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Proses presensi gagal.";

                Alert.alert(
                    "Presensi gagal",
                    message
                );
            } finally {
                setProcessing(false);
            }
        };

    const formatTime = (
        date: Date,
    ): string => {
        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            },
        );
    };

    const formatDate = (
        date: Date,
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

    const pageTitle =
        mode === "check-in"
            ? "Presensi Masuk"
            : "Presensi Pulang";

    const buttonTitle =
        mode === "check-in"
            ? "PRESENSI MASUK"
            : "PRESENSI PULANG";

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
                    {pageTitle}
                </Text>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={INITIAL_REGION}
                    showsCompass
                    showsBuildings
                    showsUserLocation={false}
                >
                    <Polygon
                        coordinates={AREA_PRESENSI}
                        fillColor="rgba(255, 60, 60, 0.25)"
                        strokeColor="#FF3434"
                        strokeWidth={2}
                    />

                    {currentLocation ? (
                        <Marker
                            coordinate={currentLocation}
                            title="Posisi Anda"
                            description={
                                isInsideArea
                                    ? "Di dalam area presensi"
                                    : "Di luar area presensi"
                            }
                            pinColor={
                                isInsideArea
                                    ? "#3F70FF"
                                    : "#FF3434"
                            }
                        />
                    ) : null}
                </MapView>

                {loadingLocation ? (
                    <View style={styles.mapLoading}>
                        <ActivityIndicator
                            size="large"
                            color="#3F70FF"
                        />

                        <Text
                            style={
                                styles.mapLoadingText
                            }
                        >
                            Mengambil lokasi...
                        </Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={getCurrentLocation}
                    disabled={loadingLocation}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="location"
                        size={25}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <View
                    style={[
                        styles.areaStatus,
                        isInsideArea
                            ? styles.areaStatusInside
                            : styles.areaStatusOutside,
                    ]}
                >
                    <Ionicons
                        name={
                            isInsideArea
                                ? "checkmark-circle"
                                : "close-circle"
                        }
                        size={16}
                        color={
                            isInsideArea
                                ? "#28D17C"
                                : "#FF5C5C"
                        }
                    />

                    <Text
                        style={[
                            styles.areaStatusText,
                            {
                                color: isInsideArea
                                    ? "#28D17C"
                                    : "#FF5C5C",
                            },
                        ]}
                    >
                        {currentLocation
                            ? isInsideArea
                                ? "Di dalam area"
                                : "Di luar area"
                            : "Lokasi belum tersedia"}
                    </Text>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.dateContainer}>
                    <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#8F98AA"
                    />

                    <Text style={styles.dateText}>
                        {formatDate(currentTime)}
                    </Text>
                </View>

                <Text style={styles.timeText}>
                    {formatTime(currentTime)}
                </Text>

                <Text style={styles.locationName}>
                    Area Presensi: Gedung STTI
                    Tanjungpinang
                </Text>

                {accuracy !== null ? (
                    <Text style={styles.accuracyText}>
                        Akurasi GPS: ±
                        {Math.round(accuracy)} meter
                    </Text>
                ) : null}

                <TouchableOpacity
                    style={[
                        styles.presensiButton,
                        (!isInsideArea ||
                            !currentLocation ||
                            processing) &&
                        styles.presensiButtonDisabled,
                    ]}
                    onPress={handlePresensi}
                    disabled={
                        !isInsideArea ||
                        !currentLocation ||
                        processing
                    }
                    activeOpacity={0.8}
                >
                    {processing ? (
                        <ActivityIndicator
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <Ionicons
                                name="location"
                                size={21}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.presensiButtonText
                                }
                            >
                                {buttonTitle}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {!isInsideArea &&
                    currentLocation ? (
                    <Text style={styles.warningText}>
                        Anda harus berada di dalam area
                        presensi.
                    </Text>
                ) : null}
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
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        backgroundColor: "#0D121C",
    },

    backButton: {
        width: 35,
        height: 40,
        justifyContent: "center",
    },

    headerTitle: {
        marginLeft: 5,
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },

    mapContainer: {
        height: "58%",
        position: "relative",
        backgroundColor: "#E5E7EB",
    },

    map: {
        width: "100%",
        height: "100%",
    },

    mapLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
            "rgba(255,255,255,0.75)",
    },

    mapLoadingText: {
        marginTop: 10,
        color: "#374151",
        fontSize: 13,
    },

    locationButton: {
        position: "absolute",
        right: 15,
        bottom: 15,
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#171D28",
    },

    areaStatus: {
        position: "absolute",
        top: 15,
        right: 15,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },

    areaStatusInside: {
        backgroundColor:
            "rgba(15, 67, 47, 0.92)",
    },

    areaStatusOutside: {
        backgroundColor:
            "rgba(89, 28, 28, 0.92)",
    },

    areaStatusText: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: "700",
    },

    bottomContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 19,
        backgroundColor: "#0D121C",
    },

    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    dateText: {
        marginLeft: 8,
        color: "#8F98AA",
        fontSize: 13,
        fontWeight: "600",
    },

    timeText: {
        marginTop: 8,
        color: "#FFFFFF",
        fontSize: 43,
        fontWeight: "700",
    },

    locationName: {
        marginTop: 5,
        color: "#8F98AA",
        fontSize: 14,
        textAlign: "center",
    },

    accuracyText: {
        marginTop: 6,
        color: "#697386",
        fontSize: 12,
    },

    presensiButton: {
        width: "100%",
        height: 54,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        borderRadius: 10,
        backgroundColor: "#3F70FF",
    },

    presensiButtonDisabled: {
        opacity: 0.45,
    },

    presensiButtonText: {
        marginLeft: 8,
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    warningText: {
        marginTop: 10,
        color: "#FF5C5C",
        fontSize: 12,
    },
});