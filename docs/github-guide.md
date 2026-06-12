# 🐙 Panduan Git & GitHub untuk Proyek BudgedIn

Panduan ini berisi kumpulan perintah Git yang paling sering digunakan untuk mengelola proyek BudgedIn di GitHub, menghindari kesalahan ketik (saltik), serta mengatasi eror umum.

---

## 1. Alur Kerja Harian (Edit - Commit - Push)

Setiap kali Anda selesai melakukan perubahan kode di komputer lokal dan ingin memperbaruinya di GitHub, jalankan langkah-langkah berikut secara berurutan:

```bash
# Langkah 1: Periksa berkas apa saja yang telah berubah
git status

# Langkah 2: Tambahkan semua perubahan ke area persiapan (staging)
git add .

# Langkah 3: Simpan perubahan dengan pesan deskriptif
git commit -m "feat: deskripsi perubahan singkat"

# Langkah 4: Unggah perubahan ke GitHub
git push
```

---

## 2. Mengatasi Masalah Branch (Cabang)

Jika Anda melihat pesan eror seperti `src refspec ... does not match any` atau ingin memastikan Anda berada di branch yang benar:

### Cek Branch Aktif
```bash
git branch
```
*Tanda bintang (*) menunjukkan branch yang sedang aktif saat ini (misalnya `* main`).*

### Pindah ke Branch Lain
```bash
git checkout nama-branch
```

### Membuat dan Pindah ke Branch Baru
```bash
git checkout -b nama-branch-baru
```

---

## 3. Menghubungkan Repositori ke GitHub (Remote Setup)

Jika Anda perlu mengatur atau mengubah alamat repositori GitHub:

### Cek URL Remote Saat Ini
```bash
git remote -v
```

### Mengubah URL Remote
```bash
git remote set-url origin https://github.com/kuliahhavis-droid/BudgedIn.git
```

### Push Pertama Kali untuk Branch Baru
Jika Anda baru membuat branch di lokal dan ingin membuat branch yang sama di GitHub agar saling terhubung:
```bash
git push -u origin nama-branch-anda
```

---

## 4. Mengambil Pembaruan dari GitHub (Pull)

Jika ada perubahan kode di GitHub (misalnya Anda mengedit langsung dari web GitHub atau berkolaborasi dengan orang lain) dan ingin menyinkronkannya ke komputer lokal Anda:

```bash
git pull origin main
```

---

## 5. Tips Menghindari Eror
1. **Gunakan perintah `git`**, bukan `gitu` atau `git-u`. `git` adalah nama program resmi di terminal.
2. **Jangan menyalin output status Git sebagai perintah**. Output seperti `To https://github.com/...` adalah laporan dari Git, bukan perintah untuk diketik ulang.
3. **Selalu jalankan `git pull` sebelum mulai menulis kode**. Ini mencegah konflik kode (*merge conflicts*) jika repositori GitHub Anda sudah memiliki commit baru.
