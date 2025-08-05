import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, LogOut, Menu, X, LogIn, Settings, HelpCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigateToHistory?: () => void;
  onShowLogin?: () => void;
  onShowSignUp?: () => void;
  onShowProfile?: () => void;
  onShowHelp?: () => void;
  onShowFeedback?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigateToHistory, 
  onShowLogin, 
  onShowSignUp,
  onShowProfile,
  onShowHelp,
  onShowFeedback
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleHistoryClick = () => {
    if (onNavigateToHistory) {
      onNavigateToHistory();
    }
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...');
      await logout();
      console.log('Logout successful');
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
      
      // Clear any local storage or session data
      localStorage.removeItem('nutrisuggest_user');
      sessionStorage.clear();
      
      // Force redirect to home page and clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Gagal keluar. Silakan coba lagi.');
    }
  };

  const handleLoginClick = () => {
    if (onShowLogin) {
      onShowLogin();
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignUpClick = () => {
    if (onShowSignUp) {
      onShowSignUp();
    }
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (onShowProfile) {
      onShowProfile();
    }
    setIsProfileDropdownOpen(false);
  };

  const handleHelpClick = () => {
    if (onShowHelp) {
      onShowHelp();
    }
    setIsProfileDropdownOpen(false);
  };

  const handleFeedbackClick = () => {
    if (onShowFeedback) {
      onShowFeedback();
    }
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
      <div className="container-max">
        <div className="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">NutriSuggest</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Rekomendasi Makanan Sehat</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex items-center space-x-6"
          >
            {/* Show Login/SignUp buttons for guest users */}
            {!currentUser ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Masuk</span>
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-xl transition-all duration-300"
                >
                  <span className="text-sm font-medium">Daftar</span>
                </button>
              </>
            ) : (
              /* Profile Button for logged in users */
              <div className="relative profile-dropdown">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(currentUser.email || '')}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getUserInitials(currentUser.email || '')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {currentUser.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUser.email || ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={handleHistoryClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Riwayat</span>
                        </button>

                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Pengaturan</span>
                        </button>

                        <button
                          onClick={handleHelpClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span className="text-sm">Bantuan</span>
                        </button>

                        <button
                          onClick={handleFeedbackClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">Saran & Kritik</span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Keluar</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Show Login/SignUp buttons for guest users */}
              {!currentUser ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Masuk</span>
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl transition-all duration-300"
                  >
                    <span className="text-sm font-medium">Daftar</span>
                  </button>
                </>
              ) : (
                /* Mobile Profile Menu for logged in users */
                <>
                  {/* User Info Mobile */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials(currentUser.email || '')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {currentUser.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email || ''}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  <button
                    onClick={handleHistoryClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Riwayat</span>
                  </button>

                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Pengaturan</span>
                  </button>

                  <button
                    onClick={handleHelpClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm">Bantuan</span>
                  </button>

                  <button
                    onClick={handleFeedbackClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Saran & Kritik</span>
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Keluar</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 