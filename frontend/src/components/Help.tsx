import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle, Search, BookOpen, Video, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'Semua', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'getting-started', name: 'Memulai', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'features', name: 'Fitur', icon: <Video className="w-5 h-5" /> },
    { id: 'troubleshooting', name: 'Pemecahan Masalah', icon: <MessageCircle className="w-5 h-5" /> }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'Cara Memulai dengan NutriSuggest',
      category: 'getting-started',
      content: 'Pelajari langkah-langkah dasar untuk menggunakan NutriSuggest dan mendapatkan rekomendasi makanan sehat pertama Anda.',
      tags: ['pemula', 'tutorial', 'rekomendasi']
    },
    {
      id: 2,
      title: 'Memahami Analisis Nutrisi',
      category: 'features',
      content: 'Penjelasan lengkap tentang bagaimana NutriSuggest menganalisis nutrisi dan memberikan rekomendasi yang tepat.',
      tags: ['nutrisi', 'analisis', 'kalori']
    },
    {
      id: 3,
      title: 'Mengelola Riwayat Rekomendasi',
      category: 'features',
      content: 'Cara melihat, menyimpan, dan mengelola riwayat rekomendasi makanan sehat Anda.',
      tags: ['riwayat', 'simpan', 'kelola']
    },
    {
      id: 4,
      title: 'Mengatasi Masalah Login',
      category: 'troubleshooting',
      content: 'Solusi untuk berbagai masalah yang mungkin terjadi saat login atau mendaftar akun.',
      tags: ['login', 'error', 'akun']
    },
    {
      id: 5,
      title: 'Memilih Kondisi Kesehatan',
      category: 'getting-started',
      content: 'Panduan lengkap untuk memilih kondisi kesehatan yang tepat agar mendapatkan rekomendasi yang akurat.',
      tags: ['kesehatan', 'kondisi', 'pilihan']
    },
    {
      id: 6,
      title: 'Memahami Rekomendasi Makanan',
      category: 'features',
      content: 'Penjelasan tentang bagaimana NutriSuggest memilih dan merekomendasikan makanan berdasarkan kondisi kesehatan Anda.',
      tags: ['makanan', 'rekomendasi', 'sehat']
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
        className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
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
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pusat Bantuan</h2>
                <p className="text-sm text-gray-500">Temukan jawaban untuk pertanyaan Anda</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari bantuan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h3>
            <div className="flex flex-wrap gap-3">
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon}
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Help Articles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {searchTerm ? `Hasil Pencarian (${filteredArticles.length})` : 'Artikel Bantuan'}
            </h3>
            
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada hasil</h4>
                <p className="text-gray-500">Coba kata kunci lain atau hubungi tim support kami.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{article.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Baca
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hubungi Tim Support</h3>
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