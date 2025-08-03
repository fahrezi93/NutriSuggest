import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, ArrowRight } from 'lucide-react';

interface FoodGalleryProps {
  onViewAllFoods?: () => void;
}

const FoodGallery: React.FC<FoodGalleryProps> = ({ onViewAllFoods }) => {
  const [expandedTags, setExpandedTags] = useState<number[]>([]);

  const foods = [
    {
      name: "Ayam Panggang",
      category: "Protein Hewani",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      healthScore: 5,
      image: "🍗",
      tags: ["Tinggi Protein", "Rendah Lemak", "Lean Meat"]
    },
    {
      name: "Nasi Merah",
      category: "Makanan Pokok",
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      healthScore: 4,
      image: "🍚",
      tags: ["Tinggi Serat", "Rendah Gula", "Gluten Free"]
    },
    {
      name: "Brokoli Kukus",
      category: "Sayuran",
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      healthScore: 5,
      image: "🥦",
      tags: ["Tinggi Serat", "Antioksidan", "Rendah Kalori"]
    },
    {
      name: "Tahu Rebus",
      category: "Protein Nabati",
      calories: 76,
      protein: 8,
      carbs: 1.9,
      fat: 4.8,
      healthScore: 4,
      image: "🧈",
      tags: ["Tinggi Protein", "Vegetarian", "Rendah Karbohidrat"]
    },
    {
      name: "Pisang",
      category: "Buah-buahan",
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      healthScore: 4,
      image: "🍌",
      tags: ["Tinggi Kalium", "Serat", "Energi"]
    },
    {
      name: "Gado-gado",
      category: "Makanan Tradisional",
      calories: 320,
      protein: 12,
      carbs: 35,
      fat: 18,
      healthScore: 4,
      image: "🥗",
      tags: ["Protein Lengkap", "Tinggi Serat", "Vegetarian"]
    }
  ];

  const handleViewAllFoods = () => {
    if (onViewAllFoods) {
      onViewAllFoods();
    } else {
      // Default action - scroll to recommendation section
      const recommendationSection = document.getElementById('recommendation');
      if (recommendationSection) {
        recommendationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleTags = (index: number) => {
    setExpandedTags(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-8">
            Contoh Makanan
            <span className="block gradient-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Sehat Indonesia
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Berikut adalah beberapa contoh makanan sehat Indonesia yang sering direkomendasikan oleh NutriSuggest berdasarkan berbagai kondisi kesehatan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {foods.map((food, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
            >
              {/* Food Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {food.image}
              </div>

              {/* Health Score */}
              <div className="absolute top-6 right-6 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-gray-700">{food.healthScore}/5</span>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {food.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{food.category}</p>
                
                {/* Nutrition Info */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-sm font-bold text-blue-700">{food.calories}</div>
                    <div className="text-xs text-blue-600">kcal</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-sm font-bold text-green-700">{food.protein}g</div>
                    <div className="text-xs text-green-600">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <div className="text-sm font-bold text-orange-700">{food.carbs}g</div>
                    <div className="text-xs text-orange-600">Karbohidrat</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {expandedTags.includes(index) 
                    ? food.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))
                    : (
                      <>
                        {food.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {food.tags.length > 2 && (
                          <button
                            onClick={() => toggleTags(index)}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                          >
                            +{food.tags.length - 2}
                          </button>
                        )}
                      </>
                    )
                  }
                  {expandedTags.includes(index) && food.tags.length > 2 && (
                    <button
                      onClick={() => toggleTags(index)}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                    >
                      Tutup
                    </button>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-60"></div>
              <div className="absolute top-6 left-6 w-2 h-2 bg-secondary-400 rounded-full opacity-40"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Ingin melihat lebih banyak rekomendasi makanan sehat Indonesia?
          </p>
          <button 
            onClick={handleViewAllFoods}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Zap className="w-5 h-5 mr-3" />
            Lihat Semua Makanan
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FoodGallery; 