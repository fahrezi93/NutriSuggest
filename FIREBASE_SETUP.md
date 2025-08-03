# Firebase Setup untuk NutriSuggest

## 1. Setup Firebase Project

### 1.1 Buat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Create a project" atau "Add project"
3. Masukkan nama project: `nutrisuggest`
4. Pilih "Enable Google Analytics" (opsional)
5. Klik "Create project"

### 1.2 Enable Authentication
1. Di Firebase Console, pilih project Anda
2. Klik "Authentication" di sidebar
3. Klik "Get started"
4. Di tab "Sign-in method", enable:
   - Email/Password
   - Google
5. Klik "Save"

### 1.3 Setup Firestore Database
1. Klik "Firestore Database" di sidebar
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi database (pilih yang terdekat dengan Indonesia)
5. Klik "Done"

### 1.4 Setup Security Rules
1. Di Firestore Database, klik tab "Rules"
2. Ganti rules dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Recommendations subcollection
      match /recommendations/{recommendationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Klik "Publish"

## 2. Konfigurasi Frontend

### 2.1 Dapatkan Firebase Config
1. Di Firebase Console, klik ikon gear (⚙️) di sidebar
2. Pilih "Project settings"
3. Scroll ke bawah ke "Your apps"
4. Klik ikon web (</>)
5. Masukkan nama app: `nutrisuggest-web`
6. Klik "Register app"
7. Copy config object yang muncul

### 2.2 Update Firebase Config
1. Buka file `frontend/src/config/firebase.ts`
2. Ganti `firebaseConfig` dengan config dari Firebase Console:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 3. Konfigurasi Backend

### 3.1 Dapatkan Service Account Key
1. Di Firebase Console, klik "Project settings"
2. Klik tab "Service accounts"
3. Klik "Generate new private key"
4. Download file JSON
5. Rename file menjadi `firebase-service-account.json`
6. Pindahkan ke folder `backend/`

### 3.2 Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

## 4. Struktur Data Firestore

### 4.1 Koleksi Users
```
/users/{userId}
```

### 4.2 Subkoleksi Recommendations
```
/users/{userId}/recommendations/{recommendationId}
```

### 4.3 Struktur Data Recommendation
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "ingredients": ["ayam", "brokoli", "nasi merah"],
  "recommendation_result": {
    "foods": [
      {
        "name": "Ayam Panggang",
        "category": "Protein Hewani",
        "calories": 165,
        "protein": 31.0,
        "carbohydrates": 0.0,
        "fat": 3.6,
        "fiber": 0.0,
        "sugar": 0.0,
        "health_score": 5,
        "health_labels": ["tinggi_protein", "rendah_lemak"],
        "suitable_for": ["diabetes", "hipertensi", "obesitas"],
        "region": "Indonesia",
        "description": "Dada ayam panggang tanpa kulit"
      }
    ],
    "nutrition_analysis": {
      "total_calories": 310,
      "protein_percentage": 30,
      "carb_percentage": 45,
      "fat_percentage": 25,
      "fiber_content": 4.4,
      "sugar_content": 1.9
    },
    "health_advice": [
      "Konsumsi lebih banyak sayuran hijau",
      "Batasi makanan tinggi gula"
    ]
  }
}
```

## 5. Fitur yang Tersedia

### 5.1 Authentication
- ✅ Login dengan email/password
- ✅ Login dengan Google
- ✅ Sign up dengan email/password
- ✅ Sign up dengan Google
- ✅ Logout
- ✅ Password reset (email)

### 5.2 Firestore Integration
- ✅ Menyimpan rekomendasi otomatis setelah login
- ✅ Melihat riwayat rekomendasi
- ✅ Data terorganisir per user
- ✅ Timestamp otomatis

### 5.3 Security
- ✅ Hanya user yang login yang bisa akses fitur rekomendasi
- ✅ Data terisolasi per user
- ✅ Firestore security rules

## 6. Menjalankan Aplikasi

### 6.1 Frontend
```bash
cd frontend
npm install
npm start
```

### 6.2 Backend
```bash
cd backend
python api.py
```

## 7. Testing

### 7.1 Test Authentication
1. Buka aplikasi di browser
2. Klik "Daftar" di header
3. Buat akun dengan email/password atau Google
4. Test login/logout

### 7.2 Test Recommendation Saving
1. Login ke aplikasi
2. Dapatkan rekomendasi makanan
3. Cek di Firebase Console > Firestore Database
4. Verifikasi data tersimpan di `/users/{userId}/recommendations/`

### 7.3 Test Recommendation History
1. Login ke aplikasi
2. Dapatkan beberapa rekomendasi
3. Klik "Lihat Riwayat" di halaman hasil
4. Verifikasi riwayat muncul

## 8. Troubleshooting

### 8.1 Firebase Config Error
- Pastikan config di `frontend/src/config/firebase.ts` sudah benar
- Restart development server

### 8.2 Service Account Error
- Pastikan file `firebase-service-account.json` ada di folder `backend/`
- Pastikan file berisi JSON yang valid dari Firebase Console

### 8.3 CORS Error
- Pastikan backend berjalan di `http://localhost:5000`
- Pastikan CORS sudah dikonfigurasi dengan benar

### 8.4 Firestore Permission Error
- Pastikan security rules sudah dipublish
- Pastikan user sudah login sebelum mengakses data

## 9. Production Deployment

### 9.1 Environment Variables
Untuk production, gunakan environment variables:

```bash
# Frontend (.env)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id

# Backend
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/service-account.json
```

### 9.2 Security Rules Production
Update security rules untuk production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /recommendations/{recommendationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 10. Monitoring

### 10.1 Firebase Console
- Monitor usage di Firebase Console
- Cek Authentication > Users
- Cek Firestore Database > Data

### 10.2 Logs
- Backend logs: `python api.py`
- Frontend logs: Browser Developer Tools > Console

## 11. Backup & Recovery

### 11.1 Export Data
```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backup
```

### 11.2 Import Data
```bash
# Import Firestore data
gcloud firestore import gs://your-bucket/backup
```

## 12. Performance Optimization

### 12.1 Firestore Indexes
Buat composite indexes untuk query yang sering digunakan:

```javascript
// Index untuk query riwayat rekomendasi
collection: users/{userId}/recommendations
fields: timestamp (descending)
```

### 12.2 Caching
- Implementasi caching di frontend untuk data yang sering diakses
- Gunakan React Query atau SWR untuk state management

## 13. Security Best Practices

### 13.1 API Keys
- Jangan commit API keys ke repository
- Gunakan environment variables
- Rotate keys secara berkala

### 13.2 User Data
- Enkripsi data sensitif
- Implementasi data retention policy
- Regular security audits

### 13.3 Authentication
- Implementasi rate limiting
- Monitor suspicious login attempts
- Regular security updates

## 14. Support

Jika mengalami masalah:
1. Cek Firebase Console untuk error logs
2. Cek browser console untuk frontend errors
3. Cek terminal untuk backend errors
4. Referensi: [Firebase Documentation](https://firebase.google.com/docs) 