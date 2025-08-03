# NutriSuggest
=======
# 🍜 NutriSuggest - Aplikasi Rekomendasi Makanan Sehat Indonesia

Aplikasi rekomendasi makanan sehat yang menggabungkan **Machine Learning** dan **Sistem Pakar (Expert System)** dengan fokus pada makanan Indonesia.

## 🎯 Fitur Utama

- **Rekomendasi Makanan Sehat** berdasarkan kondisi kesehatan
- **Dataset Makanan Indonesia** dengan 24 makanan tradisional dan modern
- **Machine Learning** untuk analisis nutrisi dan clustering
- **Expert System** dengan forward chaining untuk aturan kesehatan
- **Frontend Modern** dengan React.js dan Tailwind CSS
- **Backend API** dengan Flask dan Machine Learning
- **Interface Bahasa Indonesia** yang user-friendly

## 🏗️ Struktur Proyek

```
NutriSuggest/
├── 📁 backend/                 # Backend Python + Flask API
│   ├── 📁 expert_system/      # Sistem pakar
│   ├── 📁 ml_models/          # Model machine learning
│   ├── 📁 models/             # Model yang sudah dilatih
│   ├── api.py                 # Flask API server
│   ├── app.py                 # Aplikasi Streamlit (legacy)
│   ├── demo.py                # Demo aplikasi
│   ├── train_models.py        # Training model
│   └── requirements.txt       # Dependencies Python
├── 📁 nutrisuggest-frontend/  # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/     # React components
│   │   ├── 📁 services/       # API services
│   │   └── App.tsx           # Main app
│   └── package.json          # Dependencies Node.js
├── 📁 data/                   # Dataset dan database
│   └── indonesian_food_dataset.csv
├── 📁 docs/                   # Dokumentasi
├── 📁 images/                 # Gambar dan visualisasi
├── 📁 scripts/                # Script utilitas
├── start_app.py              # Script untuk menjalankan aplikasi
└── README.md                 # Dokumentasi utama
```

## 🍽️ Dataset Makanan Indonesia

Dataset berisi **24 makanan Indonesia** dengan informasi nutrisi lengkap:

### Kategori Makanan:
- **Makanan Pokok** (3): Nasi Putih, Nasi Merah, Kentang Rebus
- **Sayuran** (5): Bayam, Kangkung, Brokoli, Wortel, Tomat
- **Protein Hewani** (3): Ayam Panggang, Ikan Salmon, Telur Rebus
- **Protein Nabati** (2): Tahu Rebus, Tempe Rebus
- **Buah-buahan** (4): Pisang, Apel, Jeruk, Alpukat
- **Makanan Tradisional** (4): Gado-gado, Pecel, Sayur Asem, Sop Ayam
- **Minuman** (3): Teh Hijau, Jus Jeruk, Air Kelapa Muda

### Kondisi Kesehatan yang Didukung:
- Diabetes
- Hipertensi
- Obesitas

## 🚀 Cara Menjalankan

### **Cara Mudah (Recommended)**

```bash
# Jalankan aplikasi lengkap (Backend + Frontend)
python start_app.py
```

Script ini akan:
- ✅ Install semua dependencies
- ✅ Start Flask API di port 5000
- ✅ Start React app di port 3000
- ✅ Buka browser otomatis

### **Cara Manual**

#### Backend (Flask API)

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Jalankan Flask API
python api.py
```

API akan berjalan di: http://localhost:5000

#### Frontend (React)

```bash
# Install dependencies
cd nutrisuggest-frontend
npm install

# Jalankan development server
npm start
```

Frontend akan berjalan di: http://localhost:3000

## 🌐 API Endpoints

### Backend API (Flask)

- `GET /api/health` - Health check
- `GET /api/foods` - Dapatkan semua makanan
- `GET /api/categories` - Dapatkan kategori makanan
- `GET /api/foods/category/<category>` - Makanan berdasarkan kategori
- `GET /api/health-conditions` - Kondisi kesehatan yang didukung
- `POST /api/recommendations` - Dapatkan rekomendasi makanan

### Contoh Request API

```javascript
// Get recommendations
const response = await fetch('http://localhost:5000/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    health_conditions: ['diabetes', 'hipertensi'],
    available_ingredients: ['ayam', 'nasi', 'sayur'],
    target_calories: 2000
  })
});
```

## 🛠️ Teknologi yang Digunakan

### Backend
- **Python 3.9+**
- **Flask** - Web framework & API
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine Learning
- **NumPy** - Numerical computing
- **SQLite** - Database

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Machine Learning
- **Random Forest** - Health classification
- **K-Means Clustering** - Food grouping
- **StandardScaler** - Data normalization

### Expert System
- **Forward Chaining** - Rule-based inference
- **IF-THEN Rules** - Health condition rules
- **Working Memory** - Dynamic data storage

## 📊 Fitur Aplikasi

### 1. **Rekomendasi Makanan**
- Input kondisi kesehatan
- Pilih bahan yang tersedia
- Dapatkan rekomendasi personalized

### 2. **Analisis Nutrisi**
- Breakdown kalori, protein, karbohidrat, lemak
- Health score untuk setiap makanan
- Visualisasi nutrisi

### 3. **Meal Planning**
- Rencana makan harian
- Kombinasi makanan seimbang
- Target kalori yang disesuaikan

### 4. **Health Tracking**
- Riwayat rekomendasi
- Progress kesehatan
- Tips nutrisi

## 🎨 UI/UX Features

- **Design Modern** dengan aesthetic Gen Z
- **Responsive** untuk semua device
- **Animasi Smooth** dengan Framer Motion
- **Dark Mode** (optional)
- **Micro-interactions** yang engaging

## 📈 Statistik Dataset

- **Total Makanan**: 24
- **Rata-rata Kalori**: 106.8 kcal
- **Rata-rata Protein**: 6.9g
- **Rata-rata Serat**: 2.5g
- **Health Score 5**: 10 makanan

## 🔧 Development

### Menambah Makanan Baru
1. Edit `backend/create_indonesian_food_dataset.py`
2. Tambahkan data makanan baru
3. Jalankan script untuk update dataset

### Mengubah Aturan Expert System
1. Edit `backend/api.py` - function `get_expert_rules()`
2. Modifikasi rules untuk kondisi kesehatan
3. Restart API server

### Customizing Frontend
1. Edit components di `nutrisuggest-frontend/src/components/`
2. Update styling di `tailwind.config.js`
3. Test responsiveness

### API Development
1. Edit `backend/api.py` untuk menambah endpoint baru
2. Update `nutrisuggest-frontend/src/services/api.ts` untuk frontend
3. Test API dengan Postman atau curl

## 📝 Dokumentasi

- `docs/INDONESIAN_DATASET_INFO.md` - Info dataset Indonesia
- `docs/PROJECT_SUMMARY.md` - Ringkasan proyek

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail

## 👥 Tim

- **Backend**: Python, Flask, ML, Expert System
- **Frontend**: React.js, TypeScript, Tailwind
- **Data**: Indonesian Food Dataset
- **UI/UX**: Modern, Gen Z aesthetic

## 🚨 Troubleshooting

### Backend tidak bisa start
```bash
# Install dependencies manual
pip install flask flask-cors pandas scikit-learn numpy

# Cek port 5000 tidak digunakan
netstat -an | findstr :5000
```

### Frontend tidak bisa start
```bash
# Install Node.js dependencies
npm install

# Clear cache
npm cache clean --force
```

### API Connection Error
- Pastikan backend berjalan di port 5000
- Cek firewall settings
- Restart kedua aplikasi

---

**🍜 NutriSuggest** - Makanan sehat untuk Indonesia yang lebih baik! 🇮🇩 

