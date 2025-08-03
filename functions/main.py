import functions_framework
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os

# Create Flask app for Firebase Functions
app = Flask(__name__)
CORS(app, origins=['*'])

# Load dataset
def load_dataset():
    try:
        # Try multiple possible paths for Firebase Functions
        possible_paths = [
            'nutrition_sampled_500.csv',
            '../data/nutrition_sampled_500.csv',
            'data/nutrition_sampled_500.csv',
            './data/nutrition_sampled_500.csv'
        ]
        
        for path in possible_paths:
            try:
                df = pd.read_csv(path)
                print(f"✅ Dataset loaded successfully from: {path}")
                return df
            except FileNotFoundError:
                continue
        
        print("❌ Dataset not found in any of the expected paths")
        return None
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return None

# Function to categorize food based on name
def categorize_food(food_name: str) -> str:
    """Categorize food based on its name"""
    name_lower = food_name.lower()
    
    # Protein Hewani
    if any(word in name_lower for word in ['ayam', 'daging', 'sapi', 'kambing', 'babi', 'ikan', 'udang', 'telur', 'susu', 'keju', 'empal', 'cumi', 'penyu', 'domba']):
        return 'Protein Hewani'
    
    # Makanan Pokok
    elif any(word in name_lower for word in ['nasi', 'beras', 'jagung', 'singkong', 'ubi', 'kentang', 'mie', 'pasta', 'roti', 'oatmeal', 'ketan', 'tepung']):
        return 'Makanan Pokok'
    
    # Sayuran
    elif any(word in name_lower for word in ['bayam', 'kangkung', 'brokoli', 'wortel', 'tomat', 'terung', 'labu', 'daun', 'sayur', 'selada', 'buncis', 'kacang panjang', 'pare', 'seledri', 'bawang', 'cabai']):
        return 'Sayuran'
    
    # Buah-buahan
    elif any(word in name_lower for word in ['pisang', 'apel', 'jeruk', 'mangga', 'buah', 'nanas', 'pepaya', 'alpukat', 'jambu', 'kedondong', 'nangka', 'markisa']):
        return 'Buah-buahan'
    
    # Protein Nabati
    elif any(word in name_lower for word in ['tahu', 'tempe', 'kacang', 'kedelai', 'oncom', 'koro']):
        return 'Protein Nabati'
    
    # Kue dan Snack
    elif any(word in name_lower for word in ['kue', 'cake', 'biskuit', 'kerupuk', 'snack', 'martabak', 'putu', 'misro', 'getuk']):
        return 'Kue dan Snack'
    
    # Minuman
    elif any(word in name_lower for word in ['teh', 'kopi', 'jus', 'es', 'minuman', 'squash']):
        return 'Minuman'
    
    # Bumbu dan Condiment
    elif any(word in name_lower for word in ['bawang', 'cabai', 'merica', 'garam', 'gula', 'minyak', 'cuka', 'petis', 'rusip']):
        return 'Bumbu dan Condiment'
    
    # Default
    else:
        return 'Lainnya'

def estimate_fiber_sugar(food_name: str, category: str, calories: float, carbs: float) -> tuple:
    """Estimate fiber and sugar content based on food category and characteristics"""
    name_lower = food_name.lower()
    
    # Base estimates
    fiber = 0.0
    sugar = 0.0
    
    if category == 'Sayuran':
        fiber = max(0.5, carbs * 0.3)
        sugar = max(0.1, carbs * 0.1)
    elif category == 'Buah-buahan':
        fiber = max(1.0, carbs * 0.15)
        sugar = max(2.0, carbs * 0.6)
    elif category == 'Protein Nabati':
        fiber = max(2.0, carbs * 0.25)
        sugar = max(0.5, carbs * 0.05)
    elif category == 'Makanan Pokok':
        fiber = max(0.5, carbs * 0.08)
        sugar = max(0.1, carbs * 0.02)
    elif category == 'Protein Hewani':
        fiber = 0.0
        sugar = 0.0
    elif category == 'Kue dan Snack':
        fiber = max(0.1, carbs * 0.02)
        sugar = max(1.0, carbs * 0.4)
    else:
        fiber = max(0.1, carbs * 0.05)
        sugar = max(0.1, carbs * 0.1)
    
    return round(fiber, 1), round(sugar, 1)

def calculate_health_score(food_name: str, category: str, calories: float, protein: float, fat: float, carbs: float, fiber: float, sugar: float, health_conditions: list) -> int:
    """Calculate health score (1-5) based on nutritional content and health conditions"""
    score = 3  # Base score
    
    # Calorie scoring
    if calories <= 100:
        score += 1
    elif calories <= 200:
        score += 0.5
    elif calories > 400:
        score -= 1
    
    # Protein scoring
    if protein >= 15:
        score += 1
    elif protein >= 10:
        score += 0.5
    elif protein < 2:
        score -= 0.5
    
    # Fat scoring
    if fat <= 5:
        score += 1
    elif fat <= 10:
        score += 0.5
    elif fat > 20:
        score -= 1
    
    # Carb scoring
    if carbs <= 20:
        score += 0.5
    elif carbs > 50:
        score -= 0.5
    
    # Fiber scoring
    if fiber >= 3:
        score += 1
    elif fiber >= 1:
        score += 0.5
    
    # Sugar scoring
    if sugar <= 2:
        score += 1
    elif sugar <= 5:
        score += 0.5
    elif sugar > 15:
        score -= 1
    
    # Category bonus
    if category in ['Sayuran', 'Buah-buahan']:
        score += 0.5
    
    # Health condition specific scoring
    for condition in health_conditions:
        if condition == 'diabetes':
            if carbs <= 25 and sugar <= 5:
                score += 1
            elif carbs > 40 or sugar > 15:
                score -= 1
        elif condition == 'hipertensi':
            if fat <= 10 and calories <= 300:
                score += 1
            elif fat > 20:
                score -= 1
        elif condition == 'obesitas':
            if calories <= 150 and fat <= 5:
                score += 1
            elif calories > 300 or fat > 15:
                score -= 1
        elif condition == 'jantung':
            if fat <= 8 and protein >= 10:
                score += 1
            elif fat > 15:
                score -= 1
    
    return max(1, min(5, int(round(score))))

# Firebase Functions HTTP triggers
@functions_framework.http
def get_health(request):
    """HTTP Cloud Function for health check"""
    return jsonify({
        'status': 'healthy',
        'message': 'NutriSuggest API is running on Firebase Functions!'
    })

@functions_framework.http
def get_foods(request):
    """HTTP Cloud Function for getting foods"""
    try:
        df = load_dataset()
        if df is None:
            return jsonify({'error': 'Dataset not found'}), 404
        
        foods = []
        for _, food in df.iterrows():
            food_dict = {
                'id': food['id'],
                'name': food['name'],
                'calories': food['calories'],
                'protein': food['proteins'],
                'fat': food['fat'],
                'carbohydrate': food['carbohydrate'],
                'image': food.get('image', ''),
                'category': categorize_food(food['name'])
            }
            foods.append(food_dict)
        
        return jsonify({
            'success': True,
            'data': foods,
            'total': len(foods)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@functions_framework.http
def get_health_conditions(request):
    """HTTP Cloud Function for getting health conditions"""
    health_conditions = [
        'diabetes',
        'hipertensi', 
        'obesitas',
        'jantung',
        'kolesterol',
        'asam_urat',
        'ginjal',
        'lambung',
        'tiroid',
        'alergi'
    ]
    return jsonify({
        'success': True,
        'data': health_conditions
    })

@functions_framework.http
def get_recommendations(request):
    """HTTP Cloud Function for getting recommendations"""
    try:
        # Handle CORS preflight
        if request.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
            return ('', 204, headers)
        
        data = request.get_json()
        health_conditions = data.get('health_conditions', [])
        available_ingredients = data.get('available_ingredients', [])
        target_calories = data.get('target_calories', 2000)
        
        df = load_dataset()
        if df is None:
            return jsonify({'error': 'Dataset not found'}), 404
        
        recommended_foods = []
        
        for _, food in df.iterrows():
            # Filter by available ingredients if provided
            if available_ingredients:
                food_name_lower = food['name'].lower()
                ingredient_match = any(ingredient.lower() in food_name_lower for ingredient in available_ingredients)
                if not ingredient_match:
                    continue
            
            # Get category and estimate fiber/sugar
            category = categorize_food(food['name'])
            fiber, sugar = estimate_fiber_sugar(food['name'], category, food['calories'], food['carbohydrate'])
            
            # Calculate health score
            health_score = calculate_health_score(
                food['name'], category, food['calories'], food['proteins'], 
                food['fat'], food['carbohydrate'], fiber, sugar, health_conditions
            )
            
            # Determine health labels
            health_labels = []
            if food['proteins'] >= 15:
                health_labels.append("tinggi_protein")
            if food['fat'] <= 5:
                health_labels.append("rendah_lemak")
            if food['carbohydrate'] <= 20:
                health_labels.append("rendah_karbohidrat")
            if fiber >= 3:
                health_labels.append("tinggi_serat")
            if food['calories'] <= 200:
                health_labels.append("rendah_kalori")
            if sugar <= 2:
                health_labels.append("rendah_gula")
            if category in ['Sayuran', 'Buah-buahan']:
                health_labels.append("antioksidan")
                
            food_dict = {
                'name': food['name'],
                'category': category,
                'calories': int(food['calories']),
                'protein': float(food['proteins']),
                'carbohydrates': float(food['carbohydrate']),
                'fat': float(food['fat']),
                'fiber': fiber,
                'sugar': sugar,
                'health_score': health_score,
                'health_labels': health_labels,
                'suitable_for': health_conditions,
                'region': 'Indonesia',
                'description': f"{food['name']} - {category}"
            }
            recommended_foods.append(food_dict)
        
        # Sort by health score and get top recommendations
        recommended_foods.sort(key=lambda x: x['health_score'], reverse=True)
        top_recommendations = recommended_foods[:10]
        
        # Calculate nutrition analysis
        if top_recommendations:
            total_calories = sum(food['calories'] for food in top_recommendations)
            total_protein = sum(food['protein'] for food in top_recommendations)
            total_carbs = sum(food['carbohydrates'] for food in top_recommendations)
            total_fat = sum(food['fat'] for food in top_recommendations)
            total_fiber = sum(food['fiber'] for food in top_recommendations)
            total_sugar = sum(food['sugar'] for food in top_recommendations)
            
            nutrition_analysis = {
                'total_calories': total_calories,
                'protein_percentage': round((total_protein * 4 / total_calories * 100) if total_calories > 0 else 0, 1),
                'carb_percentage': round((total_carbs * 4 / total_calories * 100) if total_calories > 0 else 0, 1),
                'fat_percentage': round((total_fat * 9 / total_calories * 100) if total_calories > 0 else 0, 1),
                'fiber_content': round(total_fiber, 1),
                'sugar_content': round(total_sugar, 1)
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
                health_advice.extend([
                    "Konsumsi makanan rendah gula dan tinggi serat",
                    "Pilih karbohidrat kompleks seperti nasi merah",
                    "Batasi makanan dengan indeks glikemik tinggi"
                ])
            elif condition == 'hipertensi':
                health_advice.extend([
                    "Batasi konsumsi garam dan makanan tinggi lemak",
                    "Konsumsi makanan kaya kalium seperti pisang",
                    "Pilih makanan rendah sodium"
                ])
            elif condition == 'obesitas':
                health_advice.extend([
                    "Pilih makanan rendah kalori dan tinggi serat",
                    "Konsumsi protein lean untuk kenyang lebih lama",
                    "Batasi makanan berlemak tinggi"
                ])
            elif condition == 'jantung':
                health_advice.extend([
                    "Pilih makanan rendah lemak jenuh",
                    "Konsumsi makanan kaya omega-3",
                    "Batasi makanan tinggi kolesterol"
                ])
        
        response = jsonify({
            'success': True,
            'recommended_foods': top_recommendations,
            'nutrition_analysis': nutrition_analysis,
            'health_advice': health_advice,
            'meal_plans': []
        })
        
        # Add CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        
        return response
    except Exception as e:
        print(f"Error in recommendations: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)