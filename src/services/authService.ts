import {
    LoginResponse,
    User,
} from '../types/auth';
import { supabase } from './supabase';

import {
    removeUser,
    saveUser,
} from "../storage/userStorage";

export const login = async (
    username: string,
    password: string,
): Promise<LoginResponse> => {
    try {
        const { data, error } = await supabase
            .from('user')
            .select(`
        user_id,
        username,
        nama_lengkap
      `)
            .eq('username', username.trim())
            .eq('password', password)
            .maybeSingle();

        if (error) {
            console.log('Login error:', error.message);

            return {
                success: false,
                message: 'Terjadi kesalahan saat login',
            };
        }

        if (!data) {
            return {
                success: false,
                message: 'Username atau password salah',
            };
        }

        const user: User = {
            user_id: data.user_id,
            username: data.username,
            nama_lengkap: data.nama_lengkap,
        };

        await saveUser(user);

        return {
            success: true,
            message: 'Login berhasil',
            user,
        };
    } catch (error) {
        console.log('Login exception:', error);

        return {
            success: false,
            message: 'Tidak dapat terhubung ke server',
        };
    }
};

export async function logout(): Promise<void> {
    await removeUser();
}