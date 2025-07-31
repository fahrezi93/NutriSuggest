import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import firestoreService, { SavedRecommendation } from '../services/firestore';
import { Clock, Utensils, Calendar, Eye } from 'lucide-react';

const RecommendationHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<SavedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadRecommendationHistory();
    }
  }, [currentUser]);

  const loadRecommendationHistory = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      const history = await firestoreService.getRecommendationHistory(currentUser.uid, 10);
      setRecommendations(history);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Silakan masuk untuk melihat riwayat rekomendasi</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
          Riwayat
          <span className="block gradient-text">Rekomendasi</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Lihat rekomendasi makanan yang telah Anda terima sebelumnya.
        </p>
      </motion.div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">Memuat riwayat...</span>
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat</h3>
          <p className="text-gray-600">Rekomendasi makanan akan muncul di sini setelah Anda mendapatkan rekomendasi.</p>
        </motion.div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Rekomendasi #{recommendations.length - index}
                    </h3>
                    <p className="text-sm text-gray-600">{formatDate(recommendation.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Utensils className="w-4 h-4" />
                  <span>{recommendation.recommendation_result.foods?.length || 0} makanan</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bahan yang Digunakan</h4>
                  <div className="space-y-2">
                    {recommendation.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Analisis Nutrisi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Kalori:</span>
                      <span className="font-medium">{recommendation.recommendation_result.nutrition_analysis?.total_calories || 0} kcal</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium">{recommendation.recommendation_result.nutrition_analysis?.protein_percentage || 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Karbohidrat:</span>
                      <span className="font-medium">{recommendation.recommendation_result.nutrition_analysis?.carb_percentage || 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lemak:</span>
                      <span className="font-medium">{recommendation.recommendation_result.nutrition_analysis?.fat_percentage || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {recommendation.recommendation_result.foods && recommendation.recommendation_result.foods.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Makanan yang Direkomendasikan</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recommendation.recommendation_result.foods.slice(0, 6).map((food, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{food.name}</span>
                          <span className="text-xs text-gray-500">{food.calories} kcal</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          P: {food.protein}g | K: {food.carbohydrates}g | L: {food.fat}g
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.recommendation_result.health_advice && recommendation.recommendation_result.health_advice.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Saran Kesehatan</h4>
                  <div className="space-y-2">
                    {recommendation.recommendation_result.health_advice.map((advice, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-success-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{advice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecommendationHistory; 