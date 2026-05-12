# CiliwungVibe - Architecture & Design

## 1. Misi Utama (Impact)
Aplikasi ini menyelesaikan masalah menumpuknya sampah di Bantaran Sungai Ciliwung dengan memotong birokrasi dan menghubungan pejuang lingkungan/warga langsung dengan pengepul daur ulang (Circular Economy). 

## 2. Artificial Intelligence (AI Vision)
Kami menggunakan model `gemini-2.5-flash` melalui `@google/genai` (SDK terbaru) dengan kemampuannya memproses input multimodal (teks dan gambar).

**Cara Kerja Elegan:**
1. **Melihat:** Gambar tumpukan sampah ditangkap oleh fitur `react-webcam`. Gambar di-encode ke base64 (menghindari keperluan backend penyimpanan sementara).
2. **Menganalisis:** Prompt sistem AI telah dilatih dengan *Structured Output*. AI diinstruksikan hanya mengeluarkan format JSON baku.
3. **Mengekstrak Dampak:** Model dilatih untuk memprediksi `pollutionImpact` (Rendah hingga Kritis) dan `weightEstimateKg`.
4. **Wow Factor (Self-Purification):** Model secara algoritmik menghitung metrik `selfPurificationDays` yang menyimulasikan berapa hari air sungai di area tersebut bisa jernih kembali apabila limbah kimia/plastiknya diangkat.

## 3. UI/UX "Delightful" (Glassmorphism & Eco-Neon)
Mengadopsi tren 2026, antarmuka meninggalkan tampilan kaku birokratis menjadi gamified:
*   **Eco-Neon Palette:** Hijau Lumut (`#2ECC71`) dipadukan dengan Cyan Neon (`#00F3FF`) demi mewakili "Harapan dan Teknologi Masa Depan" di tengah dominasi gelap *dark mode* sungai yang kotor.
*   **Micro-interactions:** Setiap *tap*, mulai dari *bottom navigation* hingga tombol *shutter* kamera memiliki feedback transisi dari `motion/react`.
*   **Voice Assistant:** Dirancang *accessible-first*, warga dapat menyalakan pendeteksi suara agar mereka dapat menjepret gambar dan melapor dengan instruksi suara ("Jepret", "Kirim laporan ini"). Di lapangan, tangan relawan/warga tidak selalu bersih.

## 4. Gamifikasi
"Vibe Score" memberikan motivasi intrinsik. Setiap pengiriman data tervalidasi AI akan memberikan poin untuk mencapai lencana komunal (misal: "Pahlawan Ciliwung").

## 5. Cloud-Native & Firebase
Arsitektur dibuat termodulasi. Firebase Firestore (atau *graceful fallback* Store jika terjadi gangguan jaringan) dirancang untuk beroperasi di Google Cloud Run secara *stateless*. Vile bundler akan mengemasnya menjadi SPAs (Single Page Applications) ultra-ringan memuluskan akses 4G/LTE yang tidak merata di bantaran.
