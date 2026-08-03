export interface User {
    user_id: number;
    username: string;
    nama_lengkap: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
}