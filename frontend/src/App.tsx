import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonial from './components/Testimonial';
import HowItWorks from './components/HowItWorks';
import FoodGallery from './components/FoodGallery';
import FoodRecommendation from './components/FoodRecommendation';
import NutritionAnalysis from './components/NutritionAnalysis';
import HealthConditions from './components/HealthConditions';
import RecommendationHistory from './components/RecommendationHistory';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import apiService, { RecommendationResult } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import firestoreService from './services/firestore';

function AppContent() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      await apiService.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      console.error('API connection failed:', error);
      setApiStatus('error');
    }
  };

  const handleGetRecommendations = async (data: any) => {
    setIsLoading(true);
    setActiveSection('results');
    
    try {
      const result = await apiService.getRecommendations({
        health_conditions: data.healthConditions,
        available_ingredients: data.availableIngredients,
        target_calories: data.targetCalories || 2000
      });
      
      setRecommendations(result);

      // Save recommendation to Firestore if user is logged in
      if (currentUser) {
        try {
          const recommendationData = {
            timestamp: new Date(),
            ingredients: data.availableIngredients,
            recommendation_result: {
              foods: result.recommended_foods,
              nutrition_analysis: result.nutrition_analysis,
              health_advice: result.health_advice
            }
          };

          await firestoreService.saveRecommendation(currentUser.uid, recommendationData);
          console.log('Recommendation saved to Firestore');
        } catch (error) {
          console.error('Failed to save recommendation to Firestore:', error);
        }
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      // Fallback to mock data if API fails
      const mockRecommendations: RecommendationResult = {
        success: true,
        recommended_foods: [
          {
            name: "Ayam Panggang",
            category: "Protein Hewani",
            calories: 165,
            protein: 31.0,
            carbohydrates: 0.0,
            fat: 3.6,
            fiber: 0.0,
            sugar: 0.0,
            health_score: 5,
            health_labels: ["tinggi_protein", "rendah_lemak", "rendah_karbohidrat"],
            suitable_for: ["diabetes", "hipertensi", "obesitas"],
            region: "Indonesia",
            description: "Dada ayam panggang tanpa kulit, protein lean"
          },
          {
            name: "Brokoli Kukus",
            category: "Sayuran",
            calories: 34,
            protein: 2.8,
            carbohydrates: 7.0,
            fat: 0.4,
            fiber: 2.6,
            sugar: 1.5,
            health_score: 5,
            health_labels: ["tinggi_serat", "rendah_lemak", "antioksidan"],
            suitable_for: ["diabetes", "hipertensi", "obesitas"],
            region: "Indonesia",
            description: "Brokoli kukus, kaya antioksidan dan serat"
          },
          {
            name: "Nasi Merah",
            category: "Makanan Pokok",
            calories: 111,
            protein: 2.6,
            carbohydrates: 23.0,
            fat: 0.9,
            fiber: 1.8,
            sugar: 0.4,
            health_score: 4,
            health_labels: ["tinggi_serat", "rendah_gula", "gluten_free"],
            suitable_for: ["diabetes", "hipertensi", "obesitas"],
            region: "Indonesia",
            description: "Nasi merah organik, lebih sehat dari nasi putih"
          }
        ],
        nutrition_analysis: {
          total_calories: 310,
          protein_percentage: 30,
          carb_percentage: 45,
          fat_percentage: 25,
          fiber_content: 4.4,
          sugar_content: 1.9
        },
        health_advice: [
          "Konsumsi lebih banyak sayuran hijau untuk meningkatkan asupan serat",
          "Batasi makanan tinggi gula untuk mengontrol kadar gula darah",
          "Pilih protein lean seperti ayam dan ikan untuk kesehatan jantung"
        ],
        meal_plans: [
          {
            meal_type: "Sarapan Sehat",
            total_calories: 199,
            foods: [
              { name: "Ayam Panggang", calories: 165 },
              { name: "Brokoli Kukus", calories: 34 }
            ],
            nutrition: { protein: 33.8, carbohydrates: 7.0, fat: 4.0 }
          }
        ]
      };
      
      setRecommendations(mockRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    setActiveSection('recommendation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>
      
      <Header />
      
      {/* API Status Indicator */}
      {apiStatus === 'error' && (
        <div className="fixed top-20 left-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>⚠️ API Error:</strong> Backend tidak terhubung. Gunakan data offline.
        </div>
      )}
      
      <main className="relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {activeSection === 'hero' && (
            <>
              <Hero onGetStarted={handleGetStarted} />
              <Testimonial />
              <HowItWorks onGetStarted={handleGetStarted} />
              <FoodGallery onViewAllFoods={handleGetStarted} />
            </>
          )}
          {activeSection === 'recommendation' && (
            <FoodRecommendation onSubmit={handleGetRecommendations} onBack={() => setActiveSection('hero')} />
          )}
          {activeSection === 'results' && recommendations && (
            <div className="section-padding pt-20">
              <div className="container-max">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-12">
                  <NutritionAnalysis analysis={recommendations.nutrition_analysis} healthAdvice={recommendations.health_advice} />
                  <HealthConditions recommendedFoods={recommendations.recommended_foods} mealPlans={recommendations.meal_plans} />
                  <div className="text-center space-y-4">
                    <button onClick={() => setActiveSection('recommendation')} className="btn-primary">
                      Dapatkan Rekomendasi Baru
                    </button>
                    {currentUser && (
                      <button onClick={() => setActiveSection('history')} className="btn-secondary ml-4">
                        Lihat Riwayat
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
          {activeSection === 'history' && (
            <div className="section-padding pt-20">
              <div className="container-max">
                <RecommendationHistory />
                <div className="text-center mt-8">
                  <button onClick={() => setActiveSection('hero')} className="btn-secondary">
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 