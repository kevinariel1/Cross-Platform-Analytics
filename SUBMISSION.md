# Project Submission: Cross-Platform View Tracker

Buat sebuah web application menggunakan Next.js yang menampilkan data views dari 3 akun media sosial berbeda secara bersamaan.

---

### 🚀 Pendekatan yang Digunakan

1. **Framework & UI Library**: 
   - **Next.js 15+ (App Router)**: Dipilih untuk performa optimal dan SEO (Server-Side Rendering).
   - **TypeScript**: Menjamin keamanan tipe data (*type-safety*) saat menangani data media sosial yang kompleks.
   - **Lucide React**: Untuk icon platform (TikTok, Instagram, YouTube) yang konsisten.
   - **Framer Motion**: Memberikan pengalaman premium melalui animasi transisi saat data di-refresh (Dynamic Data).

2. **Arsitektur Data**:
   - Data dikelola melalui `socialApiService` yang di-panggil secara asinkron (`async/await`) untuk mensimulasikan latensi API asli. 
   - State dikelola menggunakan React `useState` per platform untuk memungkinkan refresh data secara parsial (tidak perlu reload halaman) sesuai requirement.

3. **Design Aesthetics**:
   - Menggunakan tema **Glassmorphism Dark Mode** yang terinspirasi dari dashboard SaaS modern.
   - Visualisasi views menggunakan format singkat (15K, 1.2M) agar dashboard tetap bersih dan mudah dibaca (Kriteria UI/UX).

---

### ⚠️ Kendala dan Solusi

| Kendala | Solusi yang Diterapkan |
| :--- | :--- |
| **Keterbatasan API Resmi** (TikTok & IG memerlukan persetujuan manual yang lama) | Menyiapkan sebuah **Unified API Interface** di `src/services/socialApi.ts`. **YouTube sudah menggunakan API resmi (V3)**, sementara TikTok & IG menggunakan Mock Data dengan format data asli platform sebagai standar problem-solving untuk deadline 2-3 hari. |
| **CORS (Cross-Origin Resource Sharing)** | Integrasi API media sosial secara langsung di client-side sering terhalang CORS. Solusinya adalah menggunakan **YouTube Server-Side Fetching** (melalui Next.js) dan diproteksi oleh environment variables. |
| **Dynamic Data Refresh** | Untuk memenuhi kriteria "Refresh tanpa reload", diimplementasikan tombol *Refresh All* dan *Search* individual dengan status loading yang persisten untuk memberikan pengalaman **AJAX-style** yang modern. |

---

### 🛠️ Cara Menjalankan

1. Instalasi dependensi:
   ```bash
   npm install
   ```
2. Jalankan mode development:
   ```bash
   npm run dev
   ```
3. Project akan berjalan di `http://localhost:3000`.

---

### 🔗 Link
- **Deployment**: [TBD - your-app-link.vercel.app](https://vercel.com)
- **Repository**: [GitHub Repo](https://github.com/kevinariel1/CodingCamp-09Feb26-KevinYap)
