import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedFeatures from './components/FeaturedFeatures';
import Testimonial from './components/Testimonial';
import HowItWorks from './components/HowItWorks';
import FoodGallery from './components/FoodGallery';
import FoodRecommendation from './components/FoodRecommendation';
import NutritionAnalysis from './components/NutritionAnalysis';
import HealthConditions from './components/HealthConditions';
import RecommendationHistory from './components/RecommendationHistory';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ProfileSettings from './components/ProfileSettings';
import Help from './components/Help';
import Feedback from './components/Feedback';
import apiService, { RecommendationResult } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import firestoreService from './services/firestore';
import Login from './components/Login';
import SignUp from './components/SignUp';

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setActiveSection('hero');
      } else if (path === '/recommendation') {
        setActiveSection('recommendation');
      } else if (path === '/results') {
        setActiveSection('results');
      } else if (path === '/history') {
        setActiveSection('history');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top when activeSection changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  // Reset recommendations when user logs out
  useEffect(() => {
    if (!currentUser) {
      setRecommendations(null);
    }
  }, [currentUser]);

  // Close modals when user logs in
  useEffect(() => {
    if (currentUser) {
      setShowLoginModal(false);
      setShowSignUpModal(false);
      setShowProfileModal(false);
      setShowHelpModal(false);
      setShowFeedbackModal(false);
    }
  }, [currentUser]);

  const checkApiConnection = async () => {
    try {
      await apiService.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      console.error('API connection failed:', error);
      setApiStatus('error');
    }
  };

  const navigateToSection = (section: string) => {
    setActiveSection(section);
    // Update URL without page reload
    const path = section === 'hero' ? '/' : `/${section}`;
    window.history.pushState({}, '', path);
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetRecommendations = async (data: any) => {
    setIsLoading(true);
    navigateToSection('results');
    
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
          console.log('Saving recommendation to Firestore...');
          const recommendationData = {
            timestamp: new Date(),
            ingredients: data.availableIngredients || [],
            recommendation_result: {
              foods: result.recommended_foods || [],
              nutrition_analysis: result.nutrition_analysis || {
                total_calories: 0,
                protein_percentage: 0,
                carb_percentage: 0,
                fat_percentage: 0,
                fiber_content: 0,
                sugar_content: 0
              },
              health_advice: result.health_advice || []
            }
          };

          console.log('Recommendation data:', recommendationData);
          await firestoreService.saveRecommendation(currentUser.uid, recommendationData);
          console.log('Recommendation saved successfully');
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
          },
          {
            name: "Salmon Panggang",
            category: "Protein Hewani",
            calories: 208,
            protein: 25.0,
            carbohydrates: 0.0,
            fat: 12.0,
            fiber: 0.0,
            sugar: 0.0,
            health_score: 5,
            health_labels: ["tinggi_protein", "omega_3", "rendah_karbohidrat"],
            suitable_for: ["diabetes", "hipertensi", "obesitas"],
            region: "Indonesia",
            description: "Salmon kaya omega-3 untuk kesehatan jantung"
          },
          {
            name: "Bayam Kukus",
            category: "Sayuran",
            calories: 23,
            protein: 2.9,
            carbohydrates: 3.6,
            fat: 0.4,
            fiber: 2.2,
            sugar: 0.4,
            health_score: 5,
            health_labels: ["tinggi_serat", "rendah_lemak", "tinggi_zat_besi"],
            suitable_for: ["diabetes", "hipertensi", "obesitas"],
            region: "Indonesia",
            description: "Bayam kaya zat besi dan serat"
          }
        ],
        nutrition_analysis: {
          total_calories: 541,
          protein_percentage: 36.1,
          carb_percentage: 30.7,
          fat_percentage: 34.5,
          fiber_content: 6.6,
          sugar_content: 2.3
        },
        health_advice: [
          "Konsumsi lebih banyak sayuran hijau untuk meningkatkan asupan serat",
          "Batasi makanan tinggi gula untuk mengontrol kadar gula darah",
          "Pilih protein lean seperti ayam dan ikan untuk kesehatan jantung",
          "Pilih karbohidrat kompleks seperti nasi merah untuk energi yang lebih stabil"
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
          },
          {
            meal_type: "Makan Siang Bergizi",
            total_calories: 342,
            foods: [
              { name: "Nasi Merah", calories: 111 },
              { name: "Salmon Panggang", calories: 208 },
              { name: "Bayam Kukus", calories: 23 }
            ],
            nutrition: { protein: 52.5, carbohydrates: 33.6, fat: 16.9 }
          }
        ]
      };
      
      setRecommendations(mockRecommendations);

      // Save mock recommendation to Firestore if user is logged in
      if (currentUser) {
        try {
          console.log('Saving mock recommendation to Firestore...');
          const recommendationData = {
            timestamp: new Date(),
            ingredients: data.availableIngredients || [],
            recommendation_result: {
              foods: mockRecommendations.recommended_foods || [],
              nutrition_analysis: mockRecommendations.nutrition_analysis || {
                total_calories: 0,
                protein_percentage: 0,
                carb_percentage: 0,
                fat_percentage: 0,
                fiber_content: 0,
                sugar_content: 0
              },
              health_advice: mockRecommendations.health_advice || []
            }
          };

          console.log('Mock recommendation data:', recommendationData);
          await firestoreService.saveRecommendation(currentUser.uid, recommendationData);
          console.log('Mock recommendation saved successfully');
        } catch (error) {
          console.error('Failed to save mock recommendation to Firestore:', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigateToSection('recommendation');
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const handleShowSignUp = () => {
    setShowSignUpModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleCloseSignUp = () => {
    setShowSignUpModal(false);
  };

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const handleShowProfile = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
  };

  const handleShowHelp = () => {
    setShowHelpModal(true);
  };

  const handleCloseHelp = () => {
    setShowHelpModal(false);
  };

  const handleShowFeedback = () => {
    setShowFeedbackModal(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
      </AnimatePresence>
      
      {/* Show loading while auth is initializing */}
      {authLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat aplikasi...</p>
          </div>
        </div>
      ) : (
        <>
          <Header 
            onNavigateToHistory={() => navigateToSection('history')} 
            onShowLogin={handleShowLogin}
            onShowSignUp={handleShowSignUp}
            onShowProfile={handleShowProfile}
            onShowHelp={handleShowHelp}
            onShowFeedback={handleShowFeedback}
          />
          
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
                  <FeaturedFeatures />
                  <Testimonial />
                  <HowItWorks onGetStarted={handleGetStarted} />
                  <FoodGallery onViewAllFoods={handleGetStarted} />
                </>
              )}
              {activeSection === 'recommendation' && (
                <FoodRecommendation onSubmit={handleGetRecommendations} onBack={() => navigateToSection('hero')} />
              )}
              {activeSection === 'results' && recommendations && (
                <div className="section-padding pt-16">
                  <div className="container-max">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                      <NutritionAnalysis analysis={recommendations.nutrition_analysis} healthAdvice={recommendations.health_advice} />
                      <HealthConditions 
                        recommendedFoods={recommendations.recommended_foods || []} 
                        mealPlans={recommendations.meal_plans || []}
                        onShowHistory={() => navigateToSection('history')}
                        isLoggedIn={!!currentUser}
                      />
                      <div className="text-center pb-8">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          <button onClick={() => navigateToSection('recommendation')} className="btn-primary">
                            Dapatkan Rekomendasi Baru
                          </button>
                          {currentUser && (
                            <button onClick={() => navigateToSection('history')} className="btn-secondary">
                              Lihat Riwayat
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              {activeSection === 'history' && (
                <div className="section-padding pt-20">
                  <div className="container-max">
                    <RecommendationHistory onBack={() => navigateToSection('hero')} />
                    <div className="text-center mt-8">
                      <button onClick={() => navigateToSection('hero')} className="btn-secondary">
                        Kembali ke Beranda
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
          
          <Footer />
        </>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onClose={handleCloseLogin} 
          onSwitchToSignUp={handleSwitchToSignUp} 
        />
      )}

      {/* SignUp Modal */}
      {showSignUpModal && (
        <SignUp 
          onClose={handleCloseSignUp} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileSettings onClose={handleCloseProfile} />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <Help onClose={handleCloseHelp} />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <Feedback onClose={handleCloseFeedback} />
      )}
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