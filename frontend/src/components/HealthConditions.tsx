import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, Utensils, Plus, Minus } from 'lucide-react';

interface HealthConditionsProps {
  recommendedFoods: any[];
  mealPlans: any[];
  onShowHistory: () => void;
  isLoggedIn: boolean;
}

const HealthConditions: React.FC<HealthConditionsProps> = ({ 
  recommendedFoods, 
  mealPlans, 
  onShowHistory, 
  isLoggedIn 
}) => {
  const [expandedFoods, setExpandedFoods] = useState<{ [key: string]: boolean }>({});

  const toggleExpanded = (foodName: string) => {
    setExpandedFoods(prev => ({
      ...prev,
      [foodName]: !prev[foodName]
    }));
  };

  const getHealthLabels = (food: any) => {
    const labels = [];
    if (food.protein >= 15) labels.push('Tinggi Protein');
    if (food.fat <= 5) labels.push('Rendah Lemak');
    if (food.carbohydrates <= 20) labels.push('Rendah Karbohidrat');
    if (food.fiber >= 3) labels.push('Tinggi Serat');
    if (food.calories <= 200) labels.push('Rendah Kalori');
    if (food.sugar <= 2) labels.push('Rendah Gula');
    return labels;
  };

  const renderStars = (score: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Recommended Foods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
            <Heart className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Contoh Makanan Sehat Indonesia</h3>
            <p className="text-gray-600">Rekomendasi makanan berdasarkan kondisi kesehatan Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedFoods.map((food, index) => {
            const healthLabels = getHealthLabels(food);
            const isExpanded = expandedFoods[food.name];
            const visibleLabels = isExpanded ? healthLabels : healthLabels.slice(0, 2);
            const hasMoreLabels = healthLabels.length > 2;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-900">{food.health_score}/5</span>
                  </div>
                </div>

                {/* Food Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Utensils className="w-8 h-8 text-primary-600" />
                </div>

                {/* Food Name and Category */}
                <h4 className="text-lg font-bold text-gray-900 mb-1 text-center">{food.name}</h4>
                <p className="text-sm text-gray-600 mb-4 text-center">{food.category}</p>

                {/* Nutrition Info */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-blue-600">{food.calories}</div>
                    <div className="text-xs text-blue-500">kcal</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-green-600">{food.protein}g</div>
                    <div className="text-xs text-green-500">Protein</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-orange-600">{food.carbohydrates}g</div>
                    <div className="text-xs text-orange-500">Karbohidrat</div>
                  </div>
                </div>

                {/* Health Labels */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {visibleLabels.map((label, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                      >
                        {label}
                      </span>
                    ))}
                    {hasMoreLabels && (
                      <button
                        onClick={() => toggleExpanded(food.name)}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full hover:bg-primary-200 transition-colors duration-200 flex items-center space-x-1"
                      >
                        {isExpanded ? (
                          <>
                            <Minus className="w-3 h-3" />
                            <span>Kurang</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>+{healthLabels.length - 2}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Additional nutrition info when expanded */}
                  {isExpanded && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Lemak:</span>
                        <span className="font-medium text-gray-900">{food.fat}g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Serat:</span>
                        <span className="font-medium text-gray-900">{food.fiber}g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gula:</span>
                        <span className="font-medium text-gray-900">{food.sugar}g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(food.health_score)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="w-2 h-2 bg-primary-500 rounded-full mx-auto mt-4"></div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Meal Plans */}
      {mealPlans && mealPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Rencana Makan Sehari</h3>
              <p className="text-gray-600">Jadwal makan yang direkomendasikan untuk Anda</p>
            </div>
          </div>

          <div className="space-y-4 px-2 sm:px-0">
            {mealPlans.map((meal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{meal.meal_type}</h4>
                  <span className="text-sm font-medium text-primary-600">{meal.total_calories} kcal</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600">{meal.nutrition.protein}g</div>
                    <div className="text-xs text-gray-500">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{meal.nutrition.carbohydrates}g</div>
                    <div className="text-xs text-gray-500">Karbohidrat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-orange-600">{meal.nutrition.fat}g</div>
                    <div className="text-xs text-gray-500">Lemak</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {meal.foods.map((food: any, foodIndex: number) => (
                    <div key={foodIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{food.name}</span>
                      <span className="text-gray-500">{food.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center space-y-4"
      >
        <button onClick={() => window.location.reload()} className="btn-primary">
          Dapatkan Rekomendasi Baru
        </button>
        {isLoggedIn && (
          <button onClick={onShowHistory} className="btn-secondary">
            Lihat Riwayat Rekomendasi
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default HealthConditions; 