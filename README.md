# 📍 Presensi App

Aplikasi **Presensi App** merupakan aplikasi presensi berbasis **React Native Expo** yang memanfaatkan **Google Maps**, **Geolocation (GPS)**, dan **Supabase** sebagai backend. Aplikasi ini dirancang untuk melakukan proses **Check-In** dan **Check-Out** berdasarkan lokasi pengguna menggunakan metode **Polygon Geofence**, sehingga presensi hanya dapat dilakukan ketika pengguna berada di dalam area yang telah ditentukan.

---

# 📖 Pengenalan Aplikasi

Presensi App dibuat sebagai media pembelajaran pengembangan aplikasi mobile modern menggunakan React Native dan Supabase.

Fitur utama aplikasi meliputi:

- Login pengguna
- Dashboard Presensi
- Check-In dan Check-Out
- Validasi lokasi menggunakan GPS
- Validasi area presensi menggunakan Polygon
- Google Maps
- Riwayat Presensi
- Informasi Profil Pengguna
- Informasi Aplikasi
- Penyimpanan session menggunakan AsyncStorage

---

# 📱 Halaman Aplikasi

Aplikasi terdiri dari beberapa halaman utama berikut.

## 1. Login

Fitur:

- Login menggunakan Username dan Password
- Validasi akun ke database Supabase
- Menyimpan session login menggunakan AsyncStorage

---

## 2. Dashboard

Fitur:

- Menampilkan nama pengguna
- Menampilkan jam digital
- Status presensi hari ini
- Tombol Check-In
- Tombol Check-Out
- Statistik presensi bulanan
- Menu menuju halaman Informasi Aplikasi

---

## 3. Presensi

Fitur:

- Menampilkan Google Maps
- Menampilkan posisi pengguna
- Menampilkan Polygon Area Presensi
- Mengambil lokasi GPS
- Validasi posisi pengguna berada di dalam area presensi
- Check-In
- Check-Out

---

## 4. History Presensi

Fitur:

- Riwayat seluruh presensi pengguna
- Status Hadir
- Status Belum Pulang
- Status Tidak Hadir
- Jam Masuk
- Jam Pulang

---

## 5. Profile

Fitur:

- Menampilkan informasi pengguna
- Logout

---

## 6. Informasi Aplikasi

Fitur:

- Tentang aplikasi
- Informasi Developer
- Informasi versi aplikasi

---

# 🛠 Tech Stack

Framework

- React Native
- Expo SDK
- Expo Router

Bahasa Pemrograman

- TypeScript

Backend

- Supabase

Database

- PostgreSQL (Supabase)

Maps

- Google Maps

Location Service

- GPS / Geolocation

---

# 📚 Library yang Digunakan

Library utama yang digunakan pada proyek ini antara lain:

| Library | Fungsi |
|----------|--------|
| expo-router | Navigasi aplikasi |
| react-native-maps | Menampilkan Google Maps |
| expo-location | Mengambil lokasi GPS pengguna |
| @supabase/supabase-js | Koneksi ke Supabase |
| @react-native-async-storage/async-storage | Menyimpan session login |
| @expo/vector-icons | Icon aplikasi |
| react-native-safe-area-context | Safe Area |
| react-native-screens | Optimasi Navigation |

---

# 📂 Struktur Project

```
app/
│
├── login.tsx
├── presensi.tsx
├── info.tsx
│
├── (tabs)/
│   ├── index.tsx
│   ├── history.tsx
│   └── profile.tsx
│
src/
│
├── screens/
│
├── services/
│
├── storage/
│
├── types/
│
└── utils/
```

---

# ⚙️ Instalasi

## 1. Clone Repository

```bash
git clone https://github.com/username/presensi-app.git

cd presensi-app
```

---

## 2. Install Dependency

```bash
npm install
```

atau

```bash
yarn install
```

---

## 3. Install Library Expo

```bash
npx expo install
```

---

## 4. Jalankan Project

```bash
npx expo start
```

atau

```bash
npm start
```

---

## 5. Menjalankan di Android

```bash
npx expo run:android
```

atau

```bash
npx expo start --android
```

---

## 6. Menjalankan di iOS

```bash
npx expo run:ios
```

atau

```bash
npx expo start --ios
```

---

# 🔑 Konfigurasi Supabase

Buat file konfigurasi Supabase pada:

```
src/services/supabase.ts
```

Contoh:

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);
```

---

# 📍 Konfigurasi Google Maps

Tambahkan API Key Google Maps pada file:

```
app.json
```

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY"
    }
  }
}
```

dan

```json
"ios": {
  "config": {
    "googleMapsApiKey": "YOUR_API_KEY"
  }
}
```

---

# 📍 Fitur Geofence

Aplikasi menggunakan metode **Polygon Geofence**.

Alur kerja:

```
GPS
     │
     ▼
Ambil Latitude & Longitude
     │
     ▼
Cek Posisi terhadap Polygon
     │
 ┌── Ya ─────────────┐
 │                   │
 ▼                   ▼
Check-In        Check-Out
 │
 ▼
Simpan ke Supabase
```

---

# 👨‍💻 Developer

**STT Indonesia Tanjungpinang**

Proyek ini dibuat sebagai media pembelajaran pengembangan aplikasi mobile menggunakan:

- React Native
- Expo
- TypeScript
- Supabase
- Google Maps
- Geolocation (GPS)

---

# 📄 Lisensi

© 2026 STT Indonesia Tanjungpinang

All Rights Reserved.