import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  const faqItems: FAQItem[] = [
    {
      question: "Apa tujuan utama dari proyek ini?",
      answer: "NutriSuggest bertujuan untuk membantu masyarakat Indonesia mendapatkan rekomendasi makanan sehat yang sesuai dengan kondisi kesehatan dan preferensi mereka. Kami menggunakan teknologi AI untuk menganalisis kebutuhan nutrisi dan memberikan saran makanan yang optimal."
    },
    {
      question: "Teknologi apa yang digunakan untuk model klasifikasi?",
      answer: "Kami menggunakan machine learning dengan algoritma Random Forest dan Decision Tree untuk klasifikasi makanan berdasarkan kandungan nutrisi. Model ini dilatih dengan dataset makanan Indonesia yang komprehensif untuk memberikan akurasi yang tinggi."
    },
    {
      question: "Seberapa akurat model ini?",
      answer: "Model kami telah mencapai akurasi 85-90% dalam mengklasifikasikan makanan sehat dan memberikan rekomendasi yang sesuai. Kami terus meningkatkan performa model melalui pelatihan berkelanjutan dengan data terbaru."
    },
    {
      question: "Bagaimana cara saya berkontribusi?",
      answer: "Anda dapat berkontribusi dengan memberikan feedback, melaporkan bug, atau menyarankan fitur baru. Kami juga menerima kontribusi dalam bentuk data makanan lokal untuk memperkaya dataset kami."
    }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Frequently Asked Questions (FAQ)
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 rounded-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-medium text-white">{item.question}</span>
                  </div>
                  <div className="flex items-center">
                    {expandedItems[index] ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedItems[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-2">
                        <div className="border-t border-white/20 pt-4">
                          <p className="text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Masih punya pertanyaan? Jangan ragu untuk menghubungi kami
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Hubungi Kami
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 