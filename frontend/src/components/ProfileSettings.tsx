import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Settings, Bell, Shield } from 'lucide-react';

interface ProfileSettingsProps {
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Edit Profil</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Pengaturan Aplikasi</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Notifikasi</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Privasi & Keamanan</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettings; 