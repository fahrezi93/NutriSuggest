import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Check, Search } from 'lucide-react';
import apiService from '../services/api';

interface FoodRecommendationProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const FoodRecommendation: React.FC<FoodRecommendationProps> = ({ onSubmit, onBack }) => {
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [availableHealthConditions, setAvailableHealthConditions] = useState<string[]>([]);
  const [availableFoods, setAvailableFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load health conditions from API
      const healthResponse = await apiService.getHealthConditions();
      setAvailableHealthConditions(healthResponse.data);
    } catch (error) {
      console.error('Failed to load health conditions:', error);
      // Fallback health conditions
      setAvailableHealthConditions([
        'diabetes', 'hipertensi', 'obesitas', 'jantung', 'kolesterol', 
        'asam_urat', 'ginjal', 'lambung', 'tiroid', 'alergi'
      ]);
    }

    // Always use fallback array for available ingredients (simpler for users)
    // Dataset will be used for recommendations later
    setAvailableFoods([
      // Makanan Pokok (8 items)
      { name: 'Nasi', category: 'Makanan Pokok' },
      { name: 'Nasi Merah', category: 'Makanan Pokok' },
      { name: 'Kentang', category: 'Makanan Pokok' },
      { name: 'Ubi Jalar', category: 'Makanan Pokok' },
      { name: 'Mie', category: 'Makanan Pokok' },
      { name: 'Roti', category: 'Makanan Pokok' },
      { name: 'Oatmeal', category: 'Makanan Pokok' },
      { name: 'Jagung', category: 'Makanan Pokok' },
      
      // Protein Hewani (8 items)
      { name: 'Ayam', category: 'Protein Hewani' },
      { name: 'Ikan', category: 'Protein Hewani' },
      { name: 'Telur', category: 'Protein Hewani' },
      { name: 'Daging Sapi', category: 'Protein Hewani' },
      { name: 'Udang', category: 'Protein Hewani' },
      { name: 'Ikan Lele', category: 'Protein Hewani' },
      { name: 'Ikan Mas', category: 'Protein Hewani' },
      { name: 'Ikan Tongkol', category: 'Protein Hewani' },
      
      // Sayuran (10 items)
      { name: 'Bayam', category: 'Sayuran' },
      { name: 'Brokoli', category: 'Sayuran' },
      { name: 'Wortel', category: 'Sayuran' },
      { name: 'Kangkung', category: 'Sayuran' },
      { name: 'Tomat', category: 'Sayuran' },
      { name: 'Timun', category: 'Sayuran' },
      { name: 'Buncis', category: 'Sayuran' },
      { name: 'Kacang Panjang', category: 'Sayuran' },
      { name: 'Terong', category: 'Sayuran' },
      { name: 'Labu Siam', category: 'Sayuran' },
      
      // Protein Nabati (6 items)
      { name: 'Tahu', category: 'Protein Nabati' },
      { name: 'Tempe', category: 'Protein Nabati' },
      { name: 'Kacang Hijau', category: 'Protein Nabati' },
      { name: 'Kacang Kedelai', category: 'Protein Nabati' },
      { name: 'Kacang Merah', category: 'Protein Nabati' },
      { name: 'Kacang Tanah', category: 'Protein Nabati' },
      
      // Buah-buahan (8 items)
      { name: 'Pisang', category: 'Buah-buahan' },
      { name: 'Apel', category: 'Buah-buahan' },
      { name: 'Jeruk', category: 'Buah-buahan' },
      { name: 'Mangga', category: 'Buah-buahan' },
      { name: 'Pepaya', category: 'Buah-buahan' },
      { name: 'Nanas', category: 'Buah-buahan' },
      { name: 'Alpukat', category: 'Buah-buahan' },
      { name: 'Jambu Biji', category: 'Buah-buahan' },
      
      // Produk Susu (3 items)
      { name: 'Susu', category: 'Produk Susu' },
      { name: 'Yogurt', category: 'Produk Susu' },
      { name: 'Keju', category: 'Produk Susu' },
      
      // Bumbu dan Condiment (3 items)
      { name: 'Bawang Merah', category: 'Bumbu' },
      { name: 'Bawang Putih', category: 'Bumbu' },
      { name: 'Cabai', category: 'Bumbu' }
    ]);
    
    setLoading(false);
  };

  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient && !availableIngredients.includes(ingredient)) {
      setAvailableIngredients(prev => [...prev, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setAvailableIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (healthConditions.length === 0) {
      alert('Pilih minimal satu kondisi kesehatan');
      return;
    }
    
    onSubmit({
      healthConditions,
      availableIngredients,
      targetCalories
    });
  };

  const getHealthConditionLabel = (condition: string) => {
    const labels = {
      'diabetes': 'Diabetes',
      'hipertensi': 'Hipertensi',
      'obesitas': 'Obesitas',
      'jantung': 'Penyakit Jantung',
      'kolesterol': 'Kolesterol Tinggi',
      'asam_urat': 'Asam Urat',
      'ginjal': 'Penyakit Ginjal',
      'lambung': 'Penyakit Lambung',
      'tiroid': 'Penyakit Tiroid',
      'alergi': 'Alergi Makanan'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  // Filter foods based on search term
  const filteredFoods = availableFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button - Moved to top left */}
          <div className="mb-6 mt-10">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
              Dapatkan Rekomendasi
              <span className="block gradient-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Makanan Sehat
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Health Conditions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kondisi Kesehatan Anda
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableHealthConditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleHealthCondition(condition)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      healthConditions.includes(condition)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{getHealthConditionLabel(condition)}</span>
                      {healthConditions.includes(condition) && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Ingredients */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bahan yang Tersedia
              </h2>
              
              {/* Selected Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Bahan yang Dipilih:</h3>
                <div className="flex flex-wrap gap-3">
                  {availableIngredients.map((ingredient) => (
                    <div
                      key={ingredient}
                      className="flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full"
                    >
                      <span className="mr-2">{ingredient}</span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {availableIngredients.length === 0 && (
                    <p className="text-gray-500 italic">Belum ada bahan yang dipilih</p>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari bahan makanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                {searchTerm && (
                  <p className="text-sm text-gray-600 mt-2">
                    Menampilkan {filteredFoods.length} dari {availableFoods.length} bahan
                  </p>
                )}
              </div>

              {/* Food Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pilih dari daftar ({filteredFoods.length} bahan):
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.name}
                      type="button"
                      onClick={() => addIngredient(food.name)}
                      disabled={availableIngredients.includes(food.name)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                        availableIngredients.includes(food.name)
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-gray-500">{food.category}</div>
                    </button>
                  ))}
                </div>
                {filteredFoods.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada bahan yang cocok dengan pencarian "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Calories */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Target Kalori Harian
              </h2>
              <div className="max-w-md">
                <label className="block text-gray-700 font-medium mb-2">
                  Kalori per hari (kcal)
                </label>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  min="1000"
                  max="5000"
                  step="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Rekomendasi: 1500-2500 kcal per hari
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pb-8">
              <button
                type="submit"
                disabled={healthConditions.length === 0}
                className={`inline-flex items-center px-8 py-4 text-white font-semibold text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  healthConditions.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-2xl'
                }`}
              >
                <Plus className="w-5 h-5 mr-3" />
                Dapatkan Rekomendasi
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodRecommendation; 