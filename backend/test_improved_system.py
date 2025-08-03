#!/usr/bin/env python3
"""
Test script untuk sistem NutriSuggest yang sudah diperbaiki
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_models.nutrition_analyzer_improved import ImprovedNutritionAnalyzer
import pandas as pd

def test_nutrition_analyzer():
    """Test nutrition analyzer"""
    print("=== Testing Improved Nutrition Analyzer ===")
    
    try:
        # Initialize analyzer
        analyzer = ImprovedNutritionAnalyzer()
        print("✅ Nutrition Analyzer initialized successfully")
        
        # Test nutrition analysis
        test_food = {
            'proteins': 25.0,
            'fat': 15.0,
            'carbohydrate': 30.0
        }
        
        result = analyzer.analyze_food_nutrition(test_food)
        print("\n📊 Nutrition Analysis Result:")
        print(f"Predicted Calories: {result['predicted_calories']}")
        print(f"Calorie Level: {result['calorie_level']}")
        print(f"Protein: {result['protein_percentage']}%")
        print(f"Fat: {result['fat_percentage']}%")
        print(f"Carbohydrate: {result['carbohydrate_percentage']}%")
        print(f"Balance Score: {result['nutrition_balance']:.1f}%")
        print("Recommendations:", result['recommendations'])
        
        # Test food recommendations
        recommendations = analyzer.get_food_recommendations(500, 3)
        print(f"\n🍽️ Food Recommendations (target: 500 calories):")
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['name']} - {rec['calories']} cal")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing nutrition analyzer: {e}")
        return False

def test_dataset():
    """Test dataset loading"""
    print("\n=== Testing Dataset ===")
    
    try:
        df = pd.read_csv('../data/nutrition_sampled_500.csv')
        print(f"✅ Dataset loaded successfully")
        print(f"Shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        print(f"Sample data:")
        print(df.head(3))
        
        # Check data quality
        print(f"\n📈 Data Quality Check:")
        print(f"Missing values: {df.isnull().sum().sum()}")
        print(f"Calories range: {df['calories'].min()} - {df['calories'].max()}")
        print(f"Protein range: {df['proteins'].min()} - {df['proteins'].max()}")
        print(f"Fat range: {df['fat'].min()} - {df['fat'].max()}")
        print(f"Carbohydrate range: {df['carbohydrate'].min()} - {df['carbohydrate'].max()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing dataset: {e}")
        return False

def test_models():
    """Test trained models"""
    print("\n=== Testing Trained Models ===")
    
    try:
        import joblib
        
        # Test regression model
        regression_model = joblib.load('ml_models/models/best_regression_model.pkl')
        regression_scaler = joblib.load('ml_models/models/regression_scaler.pkl')
        print("✅ Regression model loaded successfully")
        
        # Test classification model
        classification_model = joblib.load('ml_models/models/best_classification_model.pkl')
        classification_scaler = joblib.load('ml_models/models/classification_scaler.pkl')
        classification_encoder = joblib.load('ml_models/models/classification_encoder.pkl')
        print("✅ Classification model loaded successfully")
        
        # Test prediction
        import numpy as np
        test_input = np.array([[25.0, 15.0, 30.0]])
        test_input_scaled = regression_scaler.transform(test_input)
        prediction = regression_model.predict(test_input_scaled)[0]
        print(f"✅ Test prediction: {prediction:.2f} calories")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing models: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing NutriSuggest Improved System")
    print("=" * 50)
    
    tests = [
        ("Dataset", test_dataset),
        ("Models", test_models),
        ("Nutrition Analyzer", test_nutrition_analyzer)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} test...")
        result = test_func()
        results.append((test_name, result))
    
    print("\n" + "=" * 50)
    print("📋 Test Results Summary:")
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(result for _, result in results)
    if all_passed:
        print("\n🎉 All tests passed! System is ready to use.")
    else:
        print("\n⚠️ Some tests failed. Please check the errors above.")
    
    return all_passed

if __name__ == "__main__":
    main() 