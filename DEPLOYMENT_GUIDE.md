# 🚀 NutriSuggest Deployment Guide

## 📋 **Prerequisites**
- GitHub account
- Vercel account (free)
- Firebase project (already configured)

## 🔧 **Step 1: Prepare Repository**

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/nutrisuggest.git
git push -u origin main
```

### 1.2 Repository Structure
```
NutriSuggest/
├── frontend/          # React app
├── backend/           # Python Flask API
├── data/             # Dataset files
└── README.md
```

## 🌐 **Step 2: Deploy Backend to Vercel**

### 2.1 Deploy Backend
1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure settings:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

### 2.2 Environment Variables (Backend)
Add these in Vercel dashboard:
```
PYTHONPATH=.
```

### 2.3 Upload Dataset
1. **Go to Vercel Dashboard → Your Project → Settings**
2. **Navigate to "Functions"**
3. **Upload `data/nutrition_sampled_500.csv` to the project**

### 2.4 Update Dataset Path
In `backend/api_improved.py`, update the dataset path:
```python
possible_paths = [
    'nutrition_sampled_500.csv',  # For Vercel
    '../data/nutrition_sampled_500.csv',
    'data/nutrition_sampled_500.csv',
    './data/nutrition_sampled_500.csv'
]
```

### 2.5 Deploy Backend
- Click "Deploy"
- Wait for deployment to complete
- Copy the deployment URL (e.g., `https://nutrisuggest-backend.vercel.app`)

## 🎨 **Step 3: Deploy Frontend to Vercel**

### 3.1 Deploy Frontend
1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository again**
4. **Configure settings:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3.2 Environment Variables (Frontend)
Add these in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_FIREBASE_API_KEY=AIzaSyAhuJGVaC4Rhl8RzAYQB9BM3Yc1goe-434
REACT_APP_FIREBASE_AUTH_DOMAIN=nutrisuggest-ecaed.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nutrisuggest-ecaed
REACT_APP_FIREBASE_STORAGE_BUCKET=nutrisuggest-ecaed.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=492864704692
REACT_APP_FIREBASE_APP_ID=1:492864704692:web:5d6c34e30d91c2e16a07e1
REACT_APP_FIREBASE_MEASUREMENT_ID=G-PSPT37424E
```

### 3.3 Update CORS in Backend
Update the CORS origins in `backend/api_improved.py`:
```python
CORS(app, origins=[
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'https://your-frontend-domain.vercel.app'
], supports_credentials=True)
```

### 3.4 Deploy Frontend
- Click "Deploy"
- Wait for deployment to complete
- Copy the deployment URL (e.g., `https://nutrisuggest.vercel.app`)

## 🔄 **Step 4: Update URLs**

### 4.1 Update Frontend API URL
1. **Go to Frontend Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Update `REACT_APP_API_URL`** with your backend URL

### 4.2 Update Backend CORS
1. **Go to Backend Vercel Dashboard**
2. **Redeploy** after updating CORS origins

## 🧪 **Step 5: Test Deployment**

### 5.1 Test Backend
```bash
curl https://your-backend-url.vercel.app/api/health
```

### 5.2 Test Frontend
- Visit your frontend URL
- Test all features:
  - ✅ User registration/login
  - ✅ Food recommendation
  - ✅ Nutrition analysis
  - ✅ History (if logged in)

## 🚨 **Troubleshooting**

### Common Issues:

#### 1. **CORS Errors**
- Update CORS origins in backend
- Redeploy backend

#### 2. **Dataset Not Found**
- Upload dataset to Vercel
- Update dataset path in code

#### 3. **Build Failures**
- Check requirements.txt
- Verify Python version compatibility

#### 4. **Environment Variables**
- Ensure all variables are set in Vercel
- Check variable names (REACT_APP_ prefix for frontend)

## 📱 **Alternative: Deploy to Netlify**

### For Frontend Only:
1. **Go to [Netlify](https://netlify.com)**
2. **Drag & drop** your `frontend/build` folder
3. **Or connect GitHub** repository
4. **Set build command**: `npm run build`
5. **Set publish directory**: `build`

### Environment Variables in Netlify:
- Go to **Site Settings → Environment Variables**
- Add the same variables as Vercel

## 🔒 **Security Notes**

1. **Firebase Configuration**: Already secure
2. **API Keys**: Use environment variables
3. **CORS**: Restrict to your domains only
4. **HTTPS**: Automatically enabled by Vercel/Netlify

## 📊 **Monitoring**

### Vercel Analytics:
- Built-in analytics
- Performance monitoring
- Error tracking

### Firebase Analytics:
- User behavior tracking
- Performance monitoring
- Crash reporting

## 🎉 **Success!**

Your NutriSuggest app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.vercel.app`

## 🔄 **Continuous Deployment**

Every push to `main` branch will automatically trigger a new deployment!

---

**Need Help?** Check Vercel/Netlify documentation or create an issue in your GitHub repository. 