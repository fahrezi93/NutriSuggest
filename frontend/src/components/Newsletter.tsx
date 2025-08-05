import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Bell, Users } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface NewsletterProps {
  onSubscribe?: (email: string) => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Masukkan alamat email yang valid');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubscribe) {
        onSubscribe(email);
      }
      
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Gagal berlangganan newsletter. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 shadow-2xl border border-white/50">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
                Stay Updated with NutriSuggest
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Subscribe to our newsletter for the latest updates, events, and opportunities.
              </p>
            </motion.div>

            {/* Subscription Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                    isSubmitting || !email
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-green-700 font-medium">
                        Berhasil berlangganan! Terima kasih telah bergabung dengan kami.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-3 h-3 text-primary-600" />
                </div>
                <span>Update terbaru</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-secondary-600" />
                </div>
                <span>Event eksklusif</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-success-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-3 h-3 text-success-600" />
                </div>
                <span>Tips kesehatan</span>
              </div>
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500">
                Kami menghormati privasi Anda. Email Anda tidak akan dibagikan kepada pihak ketiga.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter; 