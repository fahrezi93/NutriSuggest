import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Brain, Target, Heart } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Kondisi Kesehatan",
      description: "Rekomendasi berdasarkan diabetes, hipertensi, obesitas, dan kondisi lainnya"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Cerdas",
      description: "Sistem pakar dan machine learning untuk analisis nutrisi yang akurat"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Target Kalori",
      description: "Penyesuaian berdasarkan target kalori harian Anda"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background Gradients & Blob Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-success-400/20 to-warning-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="container-max relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
                <Heart className="w-4 h-4 mr-2" />
                AI-Powered Nutrition
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 mb-8 leading-tight">
                Temukan Makanan
                <span className="block gradient-text bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent">
                  Sehat untuk Anda
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed">
                Dapatkan rekomendasi makanan sehat berdasarkan kondisi kesehatan dan bahan yang tersedia di rumah Anda.
              </p>
              
              <motion.button
                onClick={onGetStarted}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Mulai Sekarang</span>
                <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                {/* Healthy Food Illustration */}
                <defs>
                  <linearGradient id="foodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                {/* Plate */}
                <circle cx="200" cy="200" r="120" fill="url(#foodGradient)" opacity="0.1" stroke="url(#foodGradient)" strokeWidth="2"/>
                
                {/* Vegetables */}
                <ellipse cx="180" cy="180" rx="15" ry="25" fill="#22C55E" opacity="0.8"/>
                <ellipse cx="220" cy="190" rx="12" ry="20" fill="#16A34A" opacity="0.8"/>
                <ellipse cx="190" cy="220" rx="18" ry="12" fill="#15803D" opacity="0.8"/>
                
                {/* Protein */}
                <ellipse cx="200" cy="160" rx="25" ry="15" fill="#F59E0B" opacity="0.8"/>
                <ellipse cx="170" cy="200" rx="20" ry="12" fill="#D97706" opacity="0.8"/>
                
                {/* Grains */}
                <circle cx="240" cy="180" r="8" fill="#A3A3A3" opacity="0.8"/>
                <circle cx="250" cy="190" r="6" fill="#737373" opacity="0.8"/>
                <circle cx="235" cy="195" r="7" fill="#525252" opacity="0.8"/>
                
                {/* Decorative elements */}
                <circle cx="150" cy="150" r="3" fill="#3B82F6" opacity="0.6"/>
                <circle cx="250" cy="150" r="2" fill="#8B5CF6" opacity="0.6"/>
                <circle cx="180" cy="250" r="4" fill="#EC4899" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 