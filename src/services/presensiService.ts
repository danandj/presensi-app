import type { Presensi } from "../types/presensi";
import { supabase } from "./supabase";

function formatTanggal(date: Date): string {
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const hari = String(date.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}

function formatJam(date: Date): string {
    const jam = String(date.getHours()).padStart(2, "0");
    const menit = String(date.getMinutes()).padStart(2, "0");
    const detik = String(date.getSeconds()).padStart(2, "0");

    return `${jam}:${menit}:${detik}`;
}

export async function getPresensiHariIni(
    userId: number
): Promise<Presensi | null> {
    const tanggalHariIni = formatTanggal(new Date());

    const { data, error } = await supabase
        .from("presensi")
        .select(
            `
        presensi_id,
        user_id,
        tanggal,
        jam_masuk,
        jam_pulang
      `
        )
        .eq("user_id", userId)
        .eq("tanggal", tanggalHariIni)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data as Presensi | null;
}

export async function checkIn(
    userId: number
): Promise<void> {
    const sekarang = new Date();

    const tanggalHariIni = formatTanggal(sekarang);
    const jamMasuk = formatJam(sekarang);

    const presensiHariIni =
        await getPresensiHariIni(userId);

    if (presensiHariIni?.jam_masuk) {
        throw new Error(
            "Anda sudah melakukan check-in hari ini."
        );
    }

    if (presensiHariIni) {
        const { error } = await supabase
            .from("presensi")
            .update({
                jam_masuk: jamMasuk,
            })
            .eq("presensi_id", presensiHariIni.presensi_id);

        if (error) {
            throw new Error(error.message);
        }

        return;
    }

    const { error } = await supabase
        .from("presensi")
        .insert({
            user_id: userId,
            tanggal: tanggalHariIni,
            jam_masuk: jamMasuk,
            jam_pulang: null,
        });

    if (error) {
        throw new Error(error.message);
    }
}

export async function checkOut(
    userId: number
): Promise<void> {
    const presensiHariIni =
        await getPresensiHariIni(userId);

    if (!presensiHariIni?.jam_masuk) {
        throw new Error(
            "Anda harus melakukan check-in terlebih dahulu."
        );
    }

    if (presensiHariIni.jam_pulang) {
        throw new Error(
            "Anda sudah melakukan check-out hari ini."
        );
    }

    const jamPulang = formatJam(new Date());

    const { error } = await supabase
        .from("presensi")
        .update({
            jam_pulang: jamPulang,
        })
        .eq("presensi_id", presensiHariIni.presensi_id);

    if (error) {
        throw new Error(error.message);
    }
}

export async function getTotalPresensiBulanIni(
    userId: number
): Promise<number> {
    const sekarang = new Date();

    const tanggalAwal = formatTanggal(
        new Date(
            sekarang.getFullYear(),
            sekarang.getMonth(),
            1
        )
    );

    const tanggalAkhir = formatTanggal(
        new Date(
            sekarang.getFullYear(),
            sekarang.getMonth() + 1,
            0
        )
    );

    const { count, error } = await supabase
        .from("presensi")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("user_id", userId)
        .not("jam_masuk", "is", null)
        .gte("tanggal", tanggalAwal)
        .lte("tanggal", tanggalAkhir);

    if (error) {
        throw new Error(error.message);
    }

    return count ?? 0;
}

export async function getRiwayatPresensi(
    userId: number
): Promise<Presensi[]> {
    const { data, error } = await supabase
        .from("presensi")
        .select(
            `
        presensi_id,
        user_id,
        tanggal,
        jam_masuk,
        jam_pulang
      `
        )
        .eq("user_id", userId)
        .order("tanggal", {
            ascending: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as Presensi[];
}