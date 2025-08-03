// Utility functions for handling popup-related errors

export interface PopupError {
  code: string;
  message: string;
  userMessage: string;
}

export const handlePopupError = (error: any): PopupError => {
  console.error('Popup error:', error);
  
  const errorMap: { [key: string]: PopupError } = {
    'auth/popup-blocked': {
      code: 'auth/popup-blocked',
      message: error.message,
      userMessage: 'Popup diblokir oleh browser. Silakan izinkan popup untuk situs ini dan coba lagi.'
    },
    'auth/popup-closed-by-user': {
      code: 'auth/popup-closed-by-user',
      message: error.message,
      userMessage: 'Popup ditutup sebelum proses login selesai. Silakan coba lagi.'
    },
    'auth/cancelled-popup-request': {
      code: 'auth/cancelled-popup-request',
      message: error.message,
      userMessage: 'Permintaan popup dibatalkan. Silakan coba lagi.'
    },
    'auth/network-request-failed': {
      code: 'auth/network-request-failed',
      message: error.message,
      userMessage: 'Koneksi internet bermasalah. Silakan periksa koneksi Anda dan coba lagi.'
    },
    'auth/too-many-requests': {
      code: 'auth/too-many-requests',
      message: error.message,
      userMessage: 'Terlalu banyak percobaan login. Silakan tunggu beberapa menit dan coba lagi.'
    }
  };

  const errorCode = error.code || 'unknown';
  return errorMap[errorCode] || {
    code: errorCode,
    message: error.message,
    userMessage: 'Terjadi kesalahan saat login. Silakan coba lagi.'
  };
};

export const checkPopupSupport = (): boolean => {
  try {
    // Check if popups are supported and not blocked
    const testPopup = window.open('', '_blank', 'width=1,height=1');
    if (testPopup) {
      testPopup.close();
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Popup support check failed:', error);
    return false;
  }
};

export const showPopupBlockedMessage = (): void => {
  // You can implement a toast notification here
  console.warn('Popup blocked by browser. Please allow popups for this site.');
}; 