import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load health conditions
      const healthResponse = await apiService.getHealthConditions();
      setAvailableHealthConditions(healthResponse.data);

      // Load foods for ingredient suggestions
      const foodsResponse = await apiService.getFoods();
      setAvailableFoods(foodsResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback data
      setAvailableHealthConditions(['diabetes', 'hipertensi', 'obesitas']);
      setAvailableFoods([
        { name: 'Ayam', category: 'Protein Hewani' },
        { name: 'Nasi', category: 'Makanan Pokok' },
        { name: 'Sayur Bayam', category: 'Sayuran' },
        { name: 'Tahu', category: 'Protein Nabati' },
        { name: 'Tempe', category: 'Protein Nabati' },
        { name: 'Brokoli', category: 'Sayuran' },
        { name: 'Wortel', category: 'Sayuran' },
        { name: 'Pisang', category: 'Buah-buahan' },
        { name: 'Apel', category: 'Buah-buahan' },
        { name: 'Jeruk', category: 'Buah-buahan' }
      ]);
    } finally {
      setLoading(false);
    }
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
      'obesitas': 'Obesitas'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

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
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 ml-4">
              Dapatkan Rekomendasi
              <span className="block gradient-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Makanan Sehat
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Health Conditions */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kondisi Kesehatan Anda
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
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
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-white/20">
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

              {/* Food Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih dari daftar:</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableFoods.map((food) => (
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
              </div>
            </div>

            {/* Target Calories */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-white/20">
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
            <div className="text-center">
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