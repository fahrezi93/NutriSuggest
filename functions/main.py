import functions_framework
from flask import Flask, request, jsonify
from flask_cors import CORS

# Create Flask app for Firebase Functions
app = Flask(__name__)
CORS(app, origins=['*'])

# Firebase Functions HTTP triggers
@functions_framework.http
def get_health(request):
    """HTTP Cloud Function for health check"""
    return jsonify({
        'status': 'healthy',
        'message': 'NutriSuggest API is running on Firebase Functions!'
    })

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
        
        # Mock data for testing
        mock_foods = [
            {
                'name': 'Nasi Putih',
                'category': 'Makanan Pokok',
                'calories': 130,
                'protein': 2.7,
                'carbohydrates': 28.2,
                'fat': 0.3,
                'fiber': 0.4,
                'sugar': 0.1,
                'health_score': 4,
                'health_labels': ['rendah_lemak', 'rendah_kalori'],
                'suitable_for': health_conditions,
                'region': 'Indonesia',
                'description': 'Nasi Putih - Makanan Pokok'
            },
            {
                'name': 'Ayam Goreng',
                'category': 'Protein Hewani',
                'calories': 250,
                'protein': 25.0,
                'carbohydrates': 0.0,
                'fat': 15.0,
                'fiber': 0.0,
                'sugar': 0.0,
                'health_score': 3,
                'health_labels': ['tinggi_protein'],
                'suitable_for': health_conditions,
                'region': 'Indonesia',
                'description': 'Ayam Goreng - Protein Hewani'
            },
            {
                'name': 'Sayur Bayam',
                'category': 'Sayuran',
                'calories': 23,
                'protein': 2.9,
                'carbohydrates': 3.6,
                'fat': 0.4,
                'fiber': 2.2,
                'sugar': 0.4,
                'health_score': 5,
                'health_labels': ['rendah_kalori', 'tinggi_serat', 'antioksidan'],
                'suitable_for': health_conditions,
                'region': 'Indonesia',
                'description': 'Sayur Bayam - Sayuran'
            }
        ]
        
        # Filter by available ingredients if provided
        if available_ingredients:
            filtered_foods = []
            for food in mock_foods:
                food_name_lower = food['name'].lower()
                ingredient_match = any(ingredient.lower() in food_name_lower for ingredient in available_ingredients)
                if ingredient_match:
                    filtered_foods.append(food)
            top_recommendations = filtered_foods[:10]
        else:
            top_recommendations = mock_foods
        
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