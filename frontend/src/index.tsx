import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/envCheck';

console.log('🚀 Starting NutriSuggest application...');
console.log('📦 React version:', React.version);
console.log('🌍 Environment:', process.env.NODE_ENV);

// Check if root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error: Root element not found</div>';
} else {
  console.log('✅ Root element found');
  
  // Set timeout to show error if React doesn't load
  const loadingTimeout = setTimeout(() => {
    console.error('❌ React app failed to load within 10 seconds');
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red; background: white; border-radius: 10px; margin: 20px;">
        <h2>⚠️ App Loading Timeout</h2>
        <p>The application is taking too long to load. This might be due to:</p>
        <ul style="text-align: left; max-width: 400px; margin: 10px auto;">
          <li>Slow internet connection</li>
          <li>Missing environment variables</li>
          <li>Firebase configuration error</li>
        </ul>
        <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Try Again
        </button>
      </div>
    `;
  }, 10000); // 10 seconds timeout
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    console.log('✅ React root created');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ App rendered successfully');
    
    // Clear timeout if app loads successfully
    clearTimeout(loadingTimeout);
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    clearTimeout(loadingTimeout);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h2>Error Loading App</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
} 