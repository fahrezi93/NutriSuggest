import React from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle, BookOpen, Video, MessageCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
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
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pusat Bantuan</h2>
                <p className="text-sm text-gray-500">Temukan jawaban untuk pertanyaan Anda</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Help Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Bantuan Cepat</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Cara Memulai</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Pelajari langkah-langkah dasar untuk menggunakan NutriSuggest dan mendapatkan rekomendasi makanan sehat pertama Anda.
                </p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-1">
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-2">Memahami Analisis Nutrisi</h4>
                <p className="text-sm text-green-800 mb-3">
                  Penjelasan lengkap tentang bagaimana NutriSuggest menganalisis nutrisi dan memberikan rekomendasi yang tepat.
                </p>
                <button className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center space-x-1">
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Mengelola Riwayat</h4>
                <p className="text-sm text-purple-800 mb-3">
                  Cara melihat, menyimpan, dan mengelola riwayat rekomendasi makanan sehat Anda.
                </p>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center space-x-1">
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Memilih Kondisi Kesehatan</h4>
                <p className="text-sm text-orange-800 mb-3">
                  Panduan lengkap untuk memilih kondisi kesehatan yang tepat agar mendapatkan rekomendasi yang akurat.
                </p>
                <button className="text-orange-600 text-sm font-medium hover:text-orange-700 flex items-center space-x-1">
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Video Tutorials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Video Tutorial</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Tutorial Dasar</h4>
                <p className="text-sm text-gray-600 mb-3">Pelajari cara menggunakan fitur utama aplikasi</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                  Tonton Video
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-secondary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Panduan Lengkap</h4>
                <p className="text-sm text-gray-600 mb-3">Tutorial mendalam untuk semua fitur</p>
                <button className="bg-secondary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary-700 transition-colors">
                  Tonton Video
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-8 h-8 text-success-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Tips & Trik</h4>
                <p className="text-sm text-gray-600 mb-3">Tips untuk mendapatkan hasil terbaik</p>
                <button className="bg-success-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-success-700 transition-colors">
                  Tonton Video
                </button>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Hubungi Tim Support</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">support@nutrisuggest.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Telepon</p>
                  <p className="text-xs text-gray-500">+62 21 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Lokasi</p>
                  <p className="text-xs text-gray-500">Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Help; 