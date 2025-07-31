# NutriSuggest Frontend

A modern, responsive React.js frontend for the NutriSuggest AI-powered nutrition recommendation system. Built with TypeScript, Tailwind CSS, and Framer Motion for a beautiful, interactive user experience.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with glass morphism effects
- **Interactive Forms**: Dynamic health condition selection and ingredient input
- **Real-time Analysis**: Live nutrition analysis with interactive charts
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Mobile Responsive**: Optimized for all device sizes
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **React Hook Form** - Performant forms with easy validation
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icon toolkit

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nutrisuggest-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing hero section
│   ├── FoodRecommendation.tsx  # Recommendation form
│   ├── NutritionAnalysis.tsx   # Analysis charts
│   ├── HealthConditions.tsx    # Results display
│   ├── LoadingSpinner.tsx      # Loading animation
│   └── Footer.tsx      # Footer component
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple gradient (#d946ef to #c026d3)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Display Font**: Poppins (for headings)
- **Body Font**: Inter (for body text)

### Components
- **Glass Effect**: Semi-transparent backgrounds with backdrop blur
- **Gradient Buttons**: Beautiful gradient buttons with hover effects
- **Card Hover**: Subtle lift and shadow effects on hover
- **Smooth Transitions**: 300ms transitions for all interactive elements

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎯 Key Features

### 1. Interactive Health Form
- Multi-select health conditions with visual feedback
- Dynamic ingredient input with tags
- Dietary preference selection
- Meal type and calorie goal inputs

### 2. Nutrition Analysis
- Interactive pie charts for macro distribution
- Bar charts for nutrition metrics
- Real-time calorie calculations
- Health advice display

### 3. Recommendation Display
- Tabbed interface for foods and meal plans
- Detailed nutrition information
- Health labels and categories
- Beautiful card layouts

### 4. Loading States
- Custom animated loading spinner
- Smooth transitions between states
- Progress indicators

## 🔌 Backend Integration

The frontend is designed to integrate with the Python backend API. Update the API endpoints in the components to connect with your backend:

```typescript
// Example API integration
const getRecommendations = async (data: FormData) => {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Recharts** for interactive charts
- **React Hook Form** for form management

---

Made with ❤️ for better health and nutrition 