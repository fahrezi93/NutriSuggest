import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Target } from 'lucide-react';

const FeaturedFeatures: React.FC = () => {
  const featuredFeatures = [
    {
      id: 'health-conditions',
      title: 'Kondisi Kesehatan',
      description: 'Rekomendasi berdasarkan diabetes, hipertensi, obesitas, dan kondisi lainnya',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'smart-ai',
      title: 'AI Cerdas',
      description: 'Sistem pakar dan machine learning untuk analisis nutrisi yang akurat',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-blue-600'
    },
    {
      id: 'calorie-target',
      title: 'Target Kalori',
      description: 'Penyesuaian berdasarkan target kalori harian Anda',
      icon: <Target className="w-8 h-8" />,
      color: 'from-blue-600 to-purple-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fitur Unggulan NutriSuggest
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nikmati pengalaman rekomendasi makanan sehat yang cerdas dan personal
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFeatures; 