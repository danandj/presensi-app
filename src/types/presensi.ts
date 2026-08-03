export interface Presensi {
    presensi_id: number;
    user_id: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
}

export interface StatistikPresensi {
    totalPresensi: number;
    totalHariKerja: number;
}