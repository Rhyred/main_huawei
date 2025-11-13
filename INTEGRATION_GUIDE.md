# Panduan Integrasi Router Huawei

Dokumen ini memberikan panduan langkah demi langkah untuk mengkonfigurasi router Huawei Anda agar dapat terintegrasi penuh dengan aplikasi monitoring HuaPau.

## Prasyarat

1.  Akses administratif ke antarmuka baris perintah (CLI) router Huawei Anda.
2.  Pengetahuan dasar tentang jaringan dan protokol SNMP.
3.  Aplikasi HuaPau sudah berjalan dan dapat diakses dari jaringan Anda.

## Langkah 1: Konfigurasi SNMP pada Router Huawei

Aplikasi ini menggunakan SNMP (Simple Network Management Protocol) untuk mengambil data realtime seperti status sistem, penggunaan bandwidth, dan informasi antarmuka.

1.  **Masuk ke Router Anda**:
    Gunakan SSH atau koneksi konsol untuk mengakses CLI router.

2.  **Masuk ke System View**:
    ```shell
    system-view
    ```

3.  **Aktifkan SNMP Agent**:
    Perintah ini akan mengaktifkan layanan SNMP pada router.
    ```shell
    snmp-agent
    ```

4.  **Konfigurasi Community String**:
    Community string berfungsi seperti kata sandi untuk akses SNMP. Ganti `public` dengan community string yang lebih aman jika diperlukan. Pastikan community string ini cocok dengan yang ada di file `.env` aplikasi HuaPau (`SNMP_COMMUNITY`).

    *   **Untuk Akses Read-Only (Direkomendasikan)**:
        ```shell
        snmp-agent community read public
        ```
    *   **Untuk Akses Read-Write (Jika Diperlukan)**:
        ```shell
        snmp-agent community write private
        ```

5.  **Atur Versi SNMP**:
    Aplikasi ini dikonfigurasi untuk menggunakan SNMPv2c secara default.
    ```shell
    snmp-agent sys-info version v2c
    ```

6.  **(Opsional) Batasi Akses SNMP ke IP Tertentu**:
    Untuk keamanan tambahan, Anda dapat membatasi host mana yang dapat mengirim permintaan SNMP ke router. Ganti `192.168.1.10` dengan alamat IP tempat aplikasi HuaPau berjalan.
    ```shell
    snmp-agent target-host trap-hostname MyHuaPauApp address 192.168.1.10 udp-port 162 trap-paramsname public
    ```

7.  **Simpan Konfigurasi**:
    ```shell
    save
    ```
    Konfirmasi penyimpanan saat diminta.

## Langkah 2: Konfigurasi Aplikasi HuaPau

Aplikasi HuaPau memerlukan beberapa variabel lingkungan untuk terhubung ke router Anda. Buat file `.env.local` di direktori root proyek `HuaPau` dan tambahkan variabel berikut:

```env
# File: .env.local

# --- Konfigurasi Sumber Data ---
# Pilih antara "real", "dummy", atau "hybrid"
NEXT_PUBLIC_DATA_SOURCE=real

# --- Konfigurasi SNMP ---
# Ganti dengan alamat IP router Huawei Anda
SNMP_HOST=192.168.1.1
# Community string yang Anda atur di router
SNMP_COMMUNITY=public
# Port SNMP (default adalah 161)
SNMP_PORT=161

# --- (Opsional) Konfigurasi Router untuk Fitur Tambahan ---
# Diperlukan untuk fitur yang tidak didukung oleh SNMP (misalnya, konfigurasi via SSH)
ROUTER_HOST=192.168.1.1
ROUTER_USERNAME=admin
ROUTER_PASSWORD=admin_password
```

**Penting**:
*   Pastikan tidak ada firewall antara aplikasi HuaPau dan router Anda yang memblokir port UDP `161` (port default SNMP).
*   Setelah mengubah file `.env.local`, Anda harus **me-restart server pengembangan** agar perubahan diterapkan.

## Langkah 3: Verifikasi Koneksi

1.  **Mulai Server Aplikasi**:
    Jalankan `npm run dev` dari dalam direktori `HuaPau`.

2.  **Buka Dasbor**:
    Akses aplikasi di browser Anda. Jika konfigurasi benar, Anda akan melihat data realtime dari router Anda di dasbor.

3.  **Troubleshooting**:
    *   **Tidak Ada Data**: Periksa kembali alamat IP router dan community string di file `.env.local`. Pastikan cocok dengan konfigurasi di router.
    *   **Error Koneksi**: Periksa log konsol di terminal tempat server berjalan untuk pesan error terkait SNMP. Pastikan tidak ada masalah jaringan atau firewall.
    *   **Data Tidak Akurat**: Pastikan versi SNMP (v2c) cocok antara router dan aplikasi.

Dengan mengikuti langkah-langkah ini, aplikasi HuaPau Anda seharusnya dapat terhubung dan memonitor router Huawei Anda dengan sukses.
