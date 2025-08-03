# Deployment Guide untuk NutriSuggest Frontend

## Masalah yang Diperbaiki

1. **JavaScript Bundle Loading Error**: File `main.26610293.js` tidak ditemukan (404 error)
2. **Konfigurasi Vercel**: Tidak ada file `vercel.json` yang mengatur deployment
3. **Routing**: SPA routing tidak dikonfigurasi dengan benar
4. **Build Configuration**: Script build tidak optimal

## Perbaikan yang Dilakukan

### 1. File `vercel.json`
- Menambahkan konfigurasi build untuk React app
- Mengatur routing untuk SPA (Single Page Application)
- Menambahkan cache headers untuk file statis

### 2. Package.json
- Menghapus `homepage` field yang bisa menyebabkan masalah routing
- Menambahkan script `vercel-build` untuk deployment
- Mengoptimalkan build dengan `GENERATE_SOURCEMAP=false`

### 3. Index.html
- Menghapus script debugging yang mengganggu
- Membersihkan kode yang tidak perlu

### 4. Gitignore
- Menambahkan konfigurasi gitignore yang lengkap
- Memastikan file yang tidak perlu tidak masuk ke deployment

## Langkah Deployment

1. **Commit perubahan**:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Deploy ke Vercel**:
   - Pastikan project sudah terhubung ke Vercel
   - Deploy akan otomatis trigger setelah push
   - Atau deploy manual dari dashboard Vercel

3. **Verifikasi Deployment**:
   - Cek apakah JavaScript bundle berhasil load
   - Test semua fitur aplikasi
   - Periksa console untuk error

## Environment Variables

Pastikan environment variables berikut sudah diset di Vercel dashboard:

```
REACT_APP_API_URL=https://nutrisuggest-backend.vercel.app/api
REACT_APP_FIREBASE_API_KEY=AIzaSyAhuJGVaC4Rhl8RzAYQB9BM3Yc1goe-434
REACT_APP_FIREBASE_AUTH_DOMAIN=nutrisuggest-ecaed.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nutrisuggest-ecaed
REACT_APP_FIREBASE_STORAGE_BUCKET=nutrisuggest-ecaed.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=492864704692
REACT_APP_FIREBASE_APP_ID=1:492864704692:web:5d6c34e30d91c2e16a07e1
REACT_APP_FIREBASE_MEASUREMENT_ID=G-PSPT37424E
```

## Troubleshooting

Jika masih ada masalah:

1. **Clear Vercel cache**: Hapus cache di dashboard Vercel
2. **Redeploy**: Force redeploy dari dashboard
3. **Check build logs**: Periksa log build untuk error
4. **Verify file structure**: Pastikan file `build/static/js/main.*.js` ada 