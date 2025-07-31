import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FoodItem } from '../services/api';
import { Utensils, Clock, Star, Heart, Zap, Leaf } from 'lucide-react';

interface HealthConditionsProps {
  recommendedFoods: FoodItem[];
  mealPlans: any[];
}

const HealthConditions: React.FC<HealthConditionsProps> = ({ recommendedFoods, mealPlans }) => {
  const [activeTab, setActiveTab] = useState('foods');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
          Makanan yang
          <span className="block gradient-text">Direkomendasikan</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Berikut adalah makanan sehat yang sesuai dengan kondisi kesehatan dan preferensi Anda.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'foods'
                ? 'bg-white text-primary-600 shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Makanan
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'plans'
                ? 'bg-white text-primary-600 shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rencana Makan
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'foods' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {recommendedFoods.map((food, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < food.health_score
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{food.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{food.category}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kalori:</span>
                  <span className="font-medium text-gray-900">{food.calories} kcal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-medium text-gray-900">{food.protein}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Karbohidrat:</span>
                  <span className="font-medium text-gray-900">{food.carbohydrates}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lemak:</span>
                  <span className="font-medium text-gray-900">{food.fat}g</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Skor Kesehatan</span>
                  </div>
                  <span className="text-lg font-bold text-primary-600">{food.health_score}/5</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'plans' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {mealPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{plan.meal_type}</h3>
                  <p className="text-gray-600">Total kalori: {plan.total_calories} kcal</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {plan.foods.map((food: any, foodIndex: number) => (
                  <div
                    key={foodIndex}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{food.name}</div>
                      <div className="text-sm text-gray-600">{food.calories} kcal</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{food.health_score}/5</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-medium">{plan.nutrition.protein}g</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Karbohidrat:</span>
                  <span className="font-medium">{plan.nutrition.carbohydrates}g</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lemak:</span>
                  <span className="font-medium">{plan.nutrition.fat}g</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HealthConditions; 