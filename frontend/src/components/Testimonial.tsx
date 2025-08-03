import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonial: React.FC = () => {
  const testimonials = [
    {
      name: "Aisyah",
      role: "Mahasiswa",
      avatar: "👩‍🎓",
      content: "Saya terbantu banget dengan NutriSuggest untuk ngatur makanan sehat sehari-hari!",
      rating: 5
    },
    {
      name: "Budi",
      role: "Karyawan",
      avatar: "👨‍💼",
      content: "Aplikasi ini bener-bener membantu saya yang sibuk tapi tetap mau makan sehat.",
      rating: 5
    },
    {
      name: "Sari",
      role: "Ibu Rumah Tangga",
      avatar: "👩‍👧‍👦",
      content: "Sekarang gampang banget masak makanan sehat untuk keluarga dengan rekomendasi dari NutriSuggest!",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
            <span className="block">Apa Kata</span>
            <span className="block gradient-text bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Pengguna Kami?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat NutriSuggest dalam perjalanan kesehatan mereka.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 h-full flex flex-col"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <Quote className="w-6 h-6 text-primary-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 break-words">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-primary-400 rounded-full opacity-40"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-secondary-400 rounded-full opacity-40"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial; 