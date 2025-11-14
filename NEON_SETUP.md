# Panduan Setup Database Neon (PostgreSQL)

Proyek ini sekarang menggunakan Neon untuk database PostgreSQL. Ikuti langkah-langkah ini untuk setup.

---

### Langkah 1: Buat Akun dan Proyek di Neon

1.  Buka [Neon](https://neon.tech) dan daftar untuk akun gratis.
2.  Buat proyek baru. Neon akan secara otomatis membuat database `neondb` untuk Anda.

---

### Langkah 2: Dapatkan Connection String

1.  Di dashboard proyek Neon Anda, cari bagian **Connection Details**.
2.  Pastikan Anda memilih **"Postgres"** (bukan "Prisma").
3.  Salin URL koneksi yang ditampilkan. Ini adalah `DATABASE_URL` Anda dan akan terlihat seperti ini:
    ```
    postgres://user:password@host.neon.tech/neondb?sslmode=require
    ```

---

### Langkah 3: Konfigurasi Environment Variable

1.  Buat file baru di root proyek Anda bernama `.env`.
2.  Tambahkan baris berikut ke dalam file `.env`, ganti URL dengan yang Anda salin dari Neon:
    ```
    DATABASE_URL="postgres://user:password@host.neon.tech/neondb?sslmode=require"
    ```
3.  **PENTING**: Jika Anda mendeploy ke Vercel,  Anda juga harus menambahkan `DATABASE_URL` ini ke **Environment Variables** di pengaturan proyek Vercel Anda.

---

### Langkah 4: Terapkan Skema Database

1.  Buka terminal di direktori proyek Anda.
2.  Jalankan perintah berikut untuk membuat tabel di database Neon Anda:
    ```bash
    npm run db:push
    ```

---

### Langkah 5: (Opsional) Isi Data Awal

Jika Anda ingin mengisi database dengan data contoh:
1.  Jalankan aplikasi Anda (`npm run dev`).
2.  Buka halaman Firewall.
3.  Klik tombol **"Seed Database"**.

Sekarang database Anda sudah siap digunakan baik untuk pengembangan lokal maupun di Vercel.
