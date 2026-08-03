import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User } from "../types/auth";

const USER_STORAGE_KEY = "@presensi_app_user";

/**
 * Menyimpan data user setelah login.
 */
export async function saveUser(user: User): Promise<void> {
    try {
        await AsyncStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(user)
        );
    } catch (error) {
        console.log("Gagal menyimpan user:", error);

        throw new Error("Gagal menyimpan data login.");
    }
}

/**
 * Mengambil data user yang sedang login.
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const userJson = await AsyncStorage.getItem(
            USER_STORAGE_KEY
        );

        if (!userJson) {
            return null;
        }

        return JSON.parse(userJson) as User;
    } catch (error) {
        console.log("Gagal membaca user:", error);

        return null;
    }
}

/**
 * Memeriksa apakah user sudah login.
 */
export async function isUserLoggedIn(): Promise<boolean> {
    const user = await getCurrentUser();

    return user !== null;
}

/**
 * Menghapus user ketika logout.
 */
export async function removeUser(): Promise<void> {
    try {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
        console.log("Gagal menghapus user:", error);

        throw new Error("Gagal menghapus data login.");
    }
}