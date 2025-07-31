from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import sqlite3
import json
from datetime import datetime
import os
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # You need to download your Firebase service account key and place it in the backend directory
        # For now, we'll use a placeholder - replace with your actual service account key path
        service_account_path = 'firebase-service-account.json'
        
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✅ Firebase Admin SDK initialized successfully")
            return db
        else:
            print("⚠️ Firebase service account key not found. Firestore features will be disabled.")
            print("Please download your Firebase service account key and save it as 'firebase-service-account.json'")
            return None
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
        return None

# Initialize Firebase
firestore_db = initialize_firebase()

# Load Indonesian food dataset
def load_dataset():
    """Load Indonesian food dataset"""
    try:
        df = pd.read_csv('../data/indonesian_food_dataset.csv')
        return df
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

# Initialize ML models
def initialize_models():
    """Initialize and train ML models"""
    df = load_dataset()
    if df is None:
        return None, None, None
    
    # Prepare features for ML
    features = ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar']
    X = df[features].values
    
    # Train Random Forest for health classification
    health_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    # Create dummy health labels for training (you can modify this based on your needs)
    health_labels = np.random.choice(['healthy', 'moderate', 'unhealthy'], size=len(df))
    health_classifier.fit(X, health_labels)
    
    # Train K-Means for food clustering
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    kmeans = KMeans(n_clusters=5, random_state=42)
    kmeans.fit(X_scaled)
    
    return health_classifier, kmeans, scaler

# Expert System Rules
def get_expert_rules():
    """Get expert system rules for health conditions"""
    rules = {
        'diabetes': {
            'avoid': ['tinggi_gula', 'tinggi_karbohidrat'],
            'prefer': ['rendah_gula', 'tinggi_serat', 'rendah_karbohidrat'],
            'max_calories': 200,
            'max_sugar': 5
        },
        'hipertensi': {
            'avoid': ['tinggi_garam', 'tinggi_lemak'],
            'prefer': ['rendah_lemak', 'tinggi_kalium', 'rendah_garam'],
            'max_calories': 250,
            'max_fat': 10
        },
        'obesitas': {
            'avoid': ['tinggi_lemak', 'tinggi_kalori'],
            'prefer': ['rendah_lemak', 'rendah_kalori', 'tinggi_serat'],
            'max_calories': 150,
            'max_fat': 5
        }
    }
    return rules

# API Routes
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'message': 'NutriSuggest API is running!',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'foods': '/api/foods',
            'categories': '/api/categories',
            'recommendations': '/api/recommendations',
            'health_conditions': '/api/health-conditions'
        },
        'documentation': 'Access the frontend at http://localhost:3000'
    })

@app.route('/api/foods', methods=['GET'])
def get_foods():
    """Get all Indonesian foods"""
    df = load_dataset()
    if df is None:
        return jsonify({'error': 'Dataset not found'}), 404
    
    foods = df.to_dict('records')
    return jsonify({
        'success': True,
        'data': foods,
        'total': len(foods)
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get food recommendations based on health conditions and available ingredients"""
    try:
        data = request.get_json()
        health_conditions = data.get('health_conditions', [])
        available_ingredients = data.get('available_ingredients', [])
        target_calories = data.get('target_calories', 2000)
        
        df = load_dataset()
        if df is None:
            return jsonify({'error': 'Dataset not found'}), 404
        
        # Filter foods based on available ingredients
        if available_ingredients:
            df = df[df['name'].str.contains('|'.join(available_ingredients), case=False, na=False)]
        
        # Apply expert system rules
        rules = get_expert_rules()
        recommended_foods = []
        
        for _, food in df.iterrows():
            score = 0
            suitable = True
            
            # Check health conditions
            for condition in health_conditions:
                if condition in rules:
                    rule = rules[condition]
                    
                    # Check if food is suitable for condition
                    if condition in food.get('suitable_for', []):
                        score += 2
                    else:
                        suitable = False
                    
                    # Check calories limit
                    if food['calories'] <= rule['max_calories']:
                        score += 1
                    
                    # Check health labels
                    health_labels = food.get('health_labels', [])
                    for label in rule['prefer']:
                        if label in health_labels:
                            score += 1
                    
                    for label in rule['avoid']:
                        if label in health_labels:
                            score -= 2
            
            if suitable:
                food_dict = food.to_dict()
                food_dict['recommendation_score'] = score
                recommended_foods.append(food_dict)
        
        # Sort by recommendation score
        recommended_foods.sort(key=lambda x: x['recommendation_score'], reverse=True)
        
        # Calculate nutrition analysis
        if recommended_foods:
            total_calories = sum(food['calories'] for food in recommended_foods[:5])
            total_protein = sum(food['protein'] for food in recommended_foods[:5])
            total_carbs = sum(food['carbohydrates'] for food in recommended_foods[:5])
            total_fat = sum(food['fat'] for food in recommended_foods[:5])
            
            nutrition_analysis = {
                'total_calories': total_calories,
                'protein_percentage': (total_protein * 4 / total_calories * 100) if total_calories > 0 else 0,
                'carb_percentage': (total_carbs * 4 / total_calories * 100) if total_calories > 0 else 0,
                'fat_percentage': (total_fat * 9 / total_calories * 100) if total_calories > 0 else 0,
                'fiber_content': sum(food['fiber'] for food in recommended_foods[:5]),
                'sugar_content': sum(food['sugar'] for food in recommended_foods[:5])
            }
        else:
            nutrition_analysis = {
                'total_calories': 0,
                'protein_percentage': 0,
                'carb_percentage': 0,
                'fat_percentage': 0,
                'fiber_content': 0,
                'sugar_content': 0
            }
        
        # Generate health advice
        health_advice = []
        for condition in health_conditions:
            if condition == 'diabetes':
                health_advice.append("Konsumsi makanan rendah gula dan tinggi serat")
                health_advice.append("Pilih karbohidrat kompleks seperti nasi merah")
            elif condition == 'hipertensi':
                health_advice.append("Batasi konsumsi garam dan makanan tinggi lemak")
                health_advice.append("Konsumsi makanan kaya kalium seperti pisang")
            elif condition == 'obesitas':
                health_advice.append("Pilih makanan rendah kalori dan tinggi serat")
                health_advice.append("Konsumsi protein lean untuk kenyang lebih lama")
        
        # Save recommendation history
        save_recommendation_history(health_conditions, recommended_foods[:5], nutrition_analysis)
        
        return jsonify({
            'success': True,
            'recommended_foods': recommended_foods[:10],
            'nutrition_analysis': nutrition_analysis,
            'health_advice': health_advice,
            'meal_plans': generate_meal_plans(recommended_foods)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get food categories"""
    df = load_dataset()
    if df is None:
        return jsonify({'error': 'Dataset not found'}), 404
    
    categories = df['category'].unique().tolist()
    return jsonify({
        'success': True,
        'data': categories
    })

@app.route('/api/foods/category/<category>', methods=['GET'])
def get_foods_by_category(category):
    """Get foods by category"""
    df = load_dataset()
    if df is None:
        return jsonify({'error': 'Dataset not found'}), 404
    
    category_foods = df[df['category'] == category].to_dict('records')
    return jsonify({
        'success': True,
        'data': category_foods,
        'category': category
    })

@app.route('/api/health-conditions', methods=['GET'])
def get_health_conditions():
    """Get supported health conditions"""
    conditions = ['diabetes', 'hipertensi', 'obesitas']
    return jsonify({
        'success': True,
        'data': conditions
    })

def save_recommendation_history(health_conditions, recommended_foods, nutrition_analysis):
    """Save recommendation history to database"""
    try:
        conn = sqlite3.connect('../data/recommendation_history.db')
        cursor = conn.cursor()
        
        # Create table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recommendations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                health_conditions TEXT,
                recommended_foods TEXT,
                nutrition_analysis TEXT
            )
        ''')
        
        # Insert recommendation
        cursor.execute('''
            INSERT INTO recommendations (timestamp, health_conditions, recommended_foods, nutrition_analysis)
            VALUES (?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            json.dumps(health_conditions),
            json.dumps([food['name'] for food in recommended_foods]),
            json.dumps(nutrition_analysis)
        ))
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"Error saving recommendation history: {e}")

def generate_meal_plans(recommended_foods):
    """Generate meal plans from recommended foods"""
    meal_plans = []
    
    if len(recommended_foods) >= 3:
        # Breakfast plan
        breakfast_foods = recommended_foods[:2]
        breakfast_calories = sum(food['calories'] for food in breakfast_foods)
        meal_plans.append({
            'meal_type': 'Sarapan Sehat',
            'total_calories': breakfast_calories,
            'foods': [{'name': food['name'], 'calories': food['calories']} for food in breakfast_foods],
            'nutrition': {
                'protein': sum(food['protein'] for food in breakfast_foods),
                'carbohydrates': sum(food['carbohydrates'] for food in breakfast_foods),
                'fat': sum(food['fat'] for food in breakfast_foods)
            }
        })
        
        # Lunch plan
        lunch_foods = recommended_foods[2:4]
        lunch_calories = sum(food['calories'] for food in lunch_foods)
        meal_plans.append({
            'meal_type': 'Makan Siang Sehat',
            'total_calories': lunch_calories,
            'foods': [{'name': food['name'], 'calories': food['calories']} for food in lunch_foods],
            'nutrition': {
                'protein': sum(food['protein'] for food in lunch_foods),
                'carbohydrates': sum(food['carbohydrates'] for food in lunch_foods),
                'fat': sum(food['fat'] for food in lunch_foods)
            }
        })
    
    return meal_plans

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'NutriSuggest API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/save-recommendation', methods=['POST'])
def save_recommendation():
    """Save recommendation to Firestore"""
    try:
        if firestore_db is None:
            return jsonify({
                'success': False,
                'message': 'Firebase not configured. Please set up Firebase Admin SDK.'
            }), 500
        
        data = request.get_json()
        user_id = data.get('userId')
        ingredients = data.get('ingredients', [])
        recommendation_result = data.get('recommendation_result', {})
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID is required'
            }), 400
        
        # Save to Firestore
        doc_ref = firestore_db.collection('users').document(user_id).collection('recommendations').add({
            'timestamp': firestore.SERVER_TIMESTAMP,
            'ingredients': ingredients,
            'recommendation_result': recommendation_result
        })
        
        return jsonify({
            'success': True,
            'message': 'Recommendation saved successfully',
            'recommendationId': doc_ref[1].id
        })
        
    except Exception as e:
        print(f"Error saving recommendation: {e}")
        return jsonify({
            'success': False,
            'message': f'Error saving recommendation: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Initialize models
    print("🚀 Initializing NutriSuggest API...")
    health_classifier, kmeans, scaler = initialize_models()
    print("✅ Models initialized successfully")
    
    # Run the API
    print("🌐 Starting API server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 