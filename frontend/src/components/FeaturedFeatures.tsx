import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Target, Users, Zap, Shield } from 'lucide-react';

const FeaturedFeatures: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Teknologi AI canggih untuk menganalisis kebutuhan nutrisi Anda secara personal",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Kesehatan Optimal",
      description: "Rekomendasi makanan yang disesuaikan dengan kondisi kesehatan Anda",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Target Kalori",
      description: "Atur target kalori harian dan dapatkan rekomendasi yang tepat",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Komunitas Sehat",
      description: "Bergabung dengan komunitas pengguna yang peduli kesehatan",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Cepat & Mudah",
      description: "Dapatkan rekomendasi dalam hitungan detik dengan antarmuka yang intuitif",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Data Terpercaya",
      description: "Berdasarkan dataset makanan Indonesia yang komprehensif dan akurat",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
            Fitur Unggulan
            <span className="block gradient-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              NutriSuggest
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nikmati berbagai fitur canggih yang dirancang khusus untuk membantu Anda mencapai gaya hidup sehat yang optimal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 border border-primary-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Mulai Perjalanan Sehat Anda
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat NutriSuggest dalam mencapai gaya hidup sehat mereka.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Mulai Sekarang
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedFeatures; 