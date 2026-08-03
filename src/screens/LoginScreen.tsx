import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { login } from '../services/authService';

export default function LoginScreen() {
    const [username, setUsername] =
        useState<string>('');

    const [password, setPassword] =
        useState<string>('');

    const [showPassword, setShowPassword] =
        useState<boolean>(false);

    const [loading, setLoading] =
        useState<boolean>(false);

    const handleLogin = async (): Promise<void> => {
        if (!username.trim()) {
            Alert.alert(
                'Peringatan',
                'Username wajib diisi',
            );
            return;
        }

        if (!password) {
            Alert.alert(
                'Peringatan',
                'Password wajib diisi',
            );
            return;
        }

        try {
            setLoading(true);

            const result = await login(
                username,
                password,
            );

            if (!result.success) {
                Alert.alert(
                    'Login gagal',
                    result.message,
                );
                return;
            }

            router.replace("/(tabs)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <View style={styles.card}>
                    <Ionicons
                        name="information-circle"
                        size={60}
                        color="#3F70FF"
                        style={styles.logo}
                    />

                    <Text style={styles.title}>
                        HadirQu
                    </Text>

                    <Text style={styles.description}>
                        Aplikasi Presensi Online Menggunakan
                        Google Maps, Geolocation dan Sensor
                        Lokasi/GPS
                    </Text>

                    <Text style={styles.label}>
                        Username
                    </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="person"
                            size={20}
                            color="#7E8799"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor="#7E8799"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <Text style={styles.label}>
                        Password
                    </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed"
                            size={20}
                            color="#7E8799"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="#7E8799"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            editable={!loading}
                            onSubmitEditing={handleLogin}
                        />

                        <Pressable
                            onPress={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            <Ionicons
                                name={
                                    showPassword
                                        ? 'eye-off'
                                        : 'eye'
                                }
                                size={23}
                                color="#687286"
                            />
                        </Pressable>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            loading && styles.disabledButton,
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                            />
                        ) : (
                            <Text style={styles.loginText}>
                                Login
                            </Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.footer}>
                        Develop By STTI Tanjungpinang
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D121C',
    },

    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },

    card: {
        paddingHorizontal: 23,
        paddingTop: 22,
        paddingBottom: 25,
        borderRadius: 18,
        backgroundColor: '#171D28',
    },

    logo: {
        alignSelf: 'center',
    },

    title: {
        marginTop: 8,
        color: '#FFFFFF',
        fontSize: 27,
        fontWeight: '700',
        textAlign: 'center',
    },

    description: {
        marginTop: 10,
        marginBottom: 35,
        color: '#969EAE',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
    },

    label: {
        marginBottom: 9,
        color: '#FFFFFF',
        fontSize: 14,
    },

    inputContainer: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 19,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#202838',
    },

    input: {
        flex: 1,
        height: '100%',
        marginLeft: 13,
        color: '#FFFFFF',
        fontSize: 15,
    },

    loginButton: {
        height: 49,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        borderRadius: 8,
        backgroundColor: '#3F70FF',
    },

    disabledButton: {
        opacity: 0.6,
    },

    loginText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    footer: {
        marginTop: 48,
        color: '#626B7D',
        fontSize: 12,
        textAlign: 'center',
    },
});