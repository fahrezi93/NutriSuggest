import pandas as pd
import numpy as np
import joblib
from typing import Dict, List
import warnings
warnings.filterwarnings('ignore')

class ImprovedNutritionAnalyzer:
    def __init__(self, data_path: str = "../data/nutrition_sampled_500.csv", models_path: str = "ml_models/models/"):
        self.data = pd.read_csv(data_path)
        self.data = self.data.rename(columns={
            'proteins': 'protein',
            'carbohydrate': 'carbohydrates',
            'name': 'food_name'
        })
        
        self.models_path = models_path
        self.load_trained_models()
    
    def load_trained_models(self):
        try:
            self.regression_model = joblib.load(f"{self.models_path}best_regression_model.pkl")
            self.regression_scaler = joblib.load(f"{self.models_path}regression_scaler.pkl")
            self.classification_model = joblib.load(f"{self.models_path}best_classification_model.pkl")
            self.classification_scaler = joblib.load(f"{self.models_path}classification_scaler.pkl")
            self.classification_encoder = joblib.load(f"{self.models_path}classification_encoder.pkl")
            print("✅ Models loaded successfully!")
        except FileNotFoundError as e:
            print(f"❌ Error loading models: {e}")
            self.regression_model = None
            self.classification_model = None
    
    def predict_calories(self, proteins: float, fat: float, carbohydrate: float) -> float:
        if self.regression_model is None:
            raise ValueError("Regression model not loaded.")
        
        input_data = np.array([[proteins, fat, carbohydrate]])
        input_scaled = self.regression_scaler.transform(input_data)
        predicted_calories = self.regression_model.predict(input_scaled)[0]
        return round(predicted_calories, 2)
    
    def predict_calorie_level(self, proteins: float, fat: float, carbohydrate: float) -> str:
        if self.classification_model is None:
            raise ValueError("Classification model not loaded.")
        
        input_data = np.array([[proteins, fat, carbohydrate]])
        input_scaled = self.classification_scaler.transform(input_data)
        predicted_encoded = self.classification_model.predict(input_scaled)[0]
        predicted_level = self.classification_encoder.inverse_transform([predicted_encoded])[0]
        return predicted_level
    
    def analyze_food_nutrition(self, food_data: Dict) -> Dict:
        proteins = food_data.get('proteins', 0)
        fat = food_data.get('fat', 0)
        carbohydrate = food_data.get('carbohydrate', 0)
        
        predicted_calories = self.predict_calories(proteins, fat, carbohydrate)
        calorie_level = self.predict_calorie_level(proteins, fat, carbohydrate)
        
        total_calories = predicted_calories
        if total_calories > 0:
            protein_pct = (proteins * 4 / total_calories) * 100
            fat_pct = (fat * 9 / total_calories) * 100
            carbs_pct = (carbohydrate * 4 / total_calories) * 100
        else:
            protein_pct = fat_pct = carbs_pct = 0
        
        recommendations = []
        if protein_pct < 10:
            recommendations.append("Kandungan protein rendah. Tambahkan sumber protein.")
        elif protein_pct > 35:
            recommendations.append("Kandungan protein tinggi. Kurangi asupan protein.")
        
        if fat_pct < 20:
            recommendations.append("Kandungan lemak rendah. Tambahkan lemak sehat.")
        elif fat_pct > 35:
            recommendations.append("Kandungan lemak tinggi. Kurangi asupan lemak.")
        
        if carbs_pct < 45:
            recommendations.append("Kandungan karbohidrat rendah. Tambahkan karbohidrat kompleks.")
        elif carbs_pct > 65:
            recommendations.append("Kandungan karbohidrat tinggi. Kurangi asupan karbohidrat.")
        
        return {
            'predicted_calories': predicted_calories,
            'calorie_level': calorie_level,
            'protein_percentage': round(protein_pct, 1),
            'fat_percentage': round(fat_pct, 1),
            'carbohydrate_percentage': round(carbs_pct, 1),
            'recommendations': recommendations,
            'nutrition_balance': self._calculate_balance_score(protein_pct, fat_pct, carbs_pct)
        }
    
    def _calculate_balance_score(self, protein_pct: float, fat_pct: float, carbs_pct: float) -> float:
        score = 0
        if 10 <= protein_pct <= 35:
            score += 1
        if 20 <= fat_pct <= 35:
            score += 1
        if 45 <= carbs_pct <= 65:
            score += 1
        return (score / 3) * 100
    
    def get_food_recommendations(self, target_calories: float, max_recommendations: int = 5) -> List[Dict]:
        calorie_range = target_calories * 0.2
        suitable_foods = self.data[
            (self.data['calories'] >= target_calories - calorie_range) &
            (self.data['calories'] <= target_calories + calorie_range)
        ]
        
        if len(suitable_foods) == 0:
            suitable_foods = self.data.copy()
        
        suitable_foods['calorie_diff'] = abs(suitable_foods['calories'] - target_calories)
        suitable_foods = suitable_foods.sort_values('calorie_diff')
        
        recommendations = []
        for _, food in suitable_foods.head(max_recommendations).iterrows():
            recommendations.append({
                'name': food['food_name'],
                'calories': food['calories'],
                'protein': food['protein'],
                'fat': food['fat'],
                'carbohydrate': food['carbohydrates'],
                'image': food.get('image', '')
            })
        
        return recommendations

if __name__ == "__main__":
    analyzer = ImprovedNutritionAnalyzer()
    
    test_food = {
        'proteins': 25.0,
        'fat': 15.0,
        'carbohydrate': 30.0
    }
    
    result = analyzer.analyze_food_nutrition(test_food)
    print("Food Analysis Result:")
    print(f"Predicted Calories: {result['predicted_calories']}")
    print(f"Calorie Level: {result['calorie_level']}")
    print(f"Protein: {result['protein_percentage']}%")
    print(f"Fat: {result['fat_percentage']}%")
    print(f"Carbohydrate: {result['carbohydrate_percentage']}%")
    print(f"Balance Score: {result['nutrition_balance']:.1f}%")
    print("Recommendations:", result['recommendations']) 