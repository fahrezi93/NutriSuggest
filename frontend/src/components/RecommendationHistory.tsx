import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Clock, Heart, Star, Calendar, AlertTriangle, X, User } from 'lucide-react';
import { getRecommendationHistory, deleteRecommendation } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import firestoreService from '../services/firestore';

interface RecommendationHistoryProps {
  onBack: () => void;
}

interface HistoryItem {
  id: string;
  timestamp: Date;
  ingredients?: string[];
  recommendation_result?: {
    foods?: any[];
    nutrition_analysis?: any;
    health_advice?: string[];
  };
}

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Apakah Anda yakin ingin menghapus rekomendasi ini?
            </p>
            <p className="text-sm text-gray-500">
              Rekomendasi dibuat pada: <span className="font-medium">{itemName}</span>
            </p>
            <p className="text-sm text-red-600 mt-2">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const RecommendationHistory: React.FC<RecommendationHistoryProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Only load history if user is logged in
    if (currentUser) {
      loadHistory();
    } else {
      // If user is not logged in, set empty history and stop loading
      setHistory([]);
      setLoading(false);
    }
  }, [currentUser]); // Add currentUser as dependency

  const loadHistory = async () => {
    try {
      setLoading(true);
      console.log('Loading history...');
      
      if (currentUser) {
        console.log('User is logged in, loading from Firestore...');
        // Use firestore service for logged in users
        const data = await firestoreService.getRecommendationHistory(currentUser.uid, 20);
        console.log('Firestore data:', data);
        setHistory(data);
      } else {
        console.log('User not logged in, setting empty history...');
        // Set empty history for non-logged in users
        setHistory([]);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      // Fallback to empty array
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, timestamp: Date) => {
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
    
    setItemToDelete({ id, name: formattedDate });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      setDeletingId(itemToDelete.id);
      console.log('Deleting recommendation:', itemToDelete.id);
      
      if (currentUser) {
        console.log('User is logged in, deleting from Firestore...');
        // Use firestore service to delete single recommendation
        await firestoreService.deleteSingleRecommendation(currentUser.uid, itemToDelete.id);
        // Remove the deleted item from local state
        setHistory(prevHistory => prevHistory.filter(item => item.id !== itemToDelete.id));
        console.log('Single recommendation deleted from Firestore');
      } else {
        console.log('User not logged in, cannot delete...');
        alert('Anda harus login untuk menghapus rekomendasi.');
      }
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete recommendation:', error);
      alert('Gagal menghapus rekomendasi. Silakan coba lagi.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              Riwayat
              <span className="block gradient-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Rekomendasi
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Lihat dan kelola rekomendasi makanan sehat Anda sebelumnya.
            </p>
          </div>

          {/* History List */}
          <div className="space-y-6">
            <AnimatePresence>
              {!currentUser ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Diperlukan</h3>
                  <p className="text-gray-600 mb-4">Anda harus login untuk melihat riwayat rekomendasi.</p>
                  <button
                    onClick={onBack}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
                  >
                    Kembali ke Beranda
                  </button>
                </motion.div>
              ) : history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Riwayat</h3>
                  <p className="text-gray-600">Mulai dengan mendapatkan rekomendasi makanan sehat pertama Anda.</p>
                </motion.div>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header with timestamp and delete button */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rekomendasi dibuat pada</p>
                          <p className="font-semibold text-gray-900">{formatDate(item.timestamp)}</p>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(item.id, item.timestamp)}
                        disabled={deletingId === item.id}
                        className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {deletingId === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Hapus</span>
                      </button>
                    </div>

                    {/* Available Ingredients */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Bahan yang Tersedia:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(item.ingredients || []).slice(0, 5).map((ingredient, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                        {(item.ingredients || []).length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                            +{(item.ingredients || []).length - 5} lainnya
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nutrition Summary */}
                    {item.recommendation_result?.nutrition_analysis && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Nutrisi:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary-600">
                              {item.recommendation_result.nutrition_analysis.total_calories || 0}
                            </div>
                            <div className="text-xs text-gray-600">Kalori</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {item.recommendation_result.nutrition_analysis.protein_percentage || 0}%
                            </div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {item.recommendation_result.nutrition_analysis.carb_percentage || 0}%
                            </div>
                            <div className="text-xs text-gray-600">Karbohidrat</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">
                              {item.recommendation_result.nutrition_analysis.fat_percentage || 0}%
                            </div>
                            <div className="text-xs text-gray-600">Lemak</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Recommendations */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Rekomendasi Teratas:</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {(item.recommendation_result?.foods || []).slice(0, 6).map((food, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{food.name || 'Unknown Food'}</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < (food.health_score || 3) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">{food.health_score || 3}/5</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(item.recommendation_result?.foods || []).length > 6 && (
                        <p className="text-sm text-gray-500 mt-3 text-center">
                          +{(item.recommendation_result?.foods || []).length - 6} rekomendasi lainnya
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Popup */}
      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || ''}
      />
    </div>
  );
};

export default RecommendationHistory; 