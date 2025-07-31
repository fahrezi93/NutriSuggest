#!/usr/bin/env python3
"""
Script testing untuk validasi sistem NutriSuggest
"""

import unittest
import pandas as pd
import numpy as np
from expert_system.forward_chaining import ForwardChainingExpertSystem
from ml_models.nutrition_analyzer import NutritionAnalyzer
import warnings
warnings.filterwarnings('ignore')

class TestNutriSuggest(unittest.TestCase):
    """Test cases untuk sistem NutriSuggest"""
    
    def setUp(self):
        """Setup untuk setiap test"""
        self.expert_system = ForwardChainingExpertSystem()
        self.nutrition_analyzer = NutritionAnalyzer()
        
    def test_data_loading(self):
        """Test loading data"""
        self.assertIsNotNone(self.expert_system.food_data)
        self.assertIsNotNone(self.nutrition_analyzer.data)
        self.assertGreater(len(self.expert_system.food_data), 1000)
        self.assertGreater(len(self.nutrition_analyzer.data), 1000)
        
    def test_rules_initialization(self):
        """Test inisialisasi aturan"""
        rules = self.expert_system.rules
        self.assertIsInstance(rules, list)
        self.assertGreater(len(rules), 0)
        
        # Test struktur aturan
        for rule in rules:
            self.assertIn('condition', rule)
            self.assertIn('if', rule)
            self.assertIn('then', rule)
            self.assertIn('priority', rule)
            self.assertIn('explanation', rule)
            
    def test_working_memory(self):
        """Test working memory"""
        self.expert_system.add_to_working_memory('test_key', 'test_value')
        self.assertEqual(self.expert_system.working_memory['test_key'], 'test_value')
        
    def test_food_filtering(self):
        """Test filtering makanan"""
        available_ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli']
        filtered_foods = self.expert_system.get_available_foods(available_ingredients)
        
        self.assertEqual(len(filtered_foods), 3)
        self.assertIn('Beras Merah', filtered_foods['food_name'].values)
        self.assertIn('Ayam Dada', filtered_foods['food_name'].values)
        self.assertIn('Brokoli', filtered_foods['food_name'].values)
        
    def test_rule_application(self):
        """Test penerapan aturan"""
        # Test data
        test_food = {
            'calories': 100, 'protein': 15, 'fat': 5, 'carbohydrates': 20,
            'fiber': 5, 'sugar': 3, 'sodium': 50, 'potassium': 400,
            'calcium': 100, 'iron': 2, 'vitamin_c': 30
        }
        
        # Test untuk diabetes
        diabetes_rules = [rule for rule in self.expert_system.rules 
                         if rule['condition'] == 'diabetes']
        
        for rule in diabetes_rules:
            result = rule['if'](test_food)
            self.assertIsInstance(result, bool)
            
    def test_meal_plan_generation(self):
        """Test generate meal plan"""
        available_ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel']
        health_conditions = ['diabetes']
        
        meal_plans = self.expert_system.generate_meal_plans(
            available_ingredients, health_conditions, 'lunch'
        )
        
        self.assertIsInstance(meal_plans, list)
        self.assertGreater(len(meal_plans), 0)
        
        # Test struktur meal plan
        for plan in meal_plans:
            self.assertIn('meal_type', plan)
            self.assertIn('foods', plan)
            self.assertIn('total_calories', plan)
            self.assertIn('total_protein', plan)
            self.assertIn('total_fat', plan)
            self.assertIn('total_carbs', plan)
            self.assertIn('total_fiber', plan)
            
    def test_nutrition_analysis(self):
        """Test analisis nutrisi"""
        # Test meal plan
        test_plan = {
            'total_calories': 300,
            'total_protein': 25,
            'total_fat': 10,
            'total_carbs': 35,
            'total_fiber': 8
        }
        
        analysis = self.nutrition_analyzer.analyze_nutritional_balance(test_plan)
        
        self.assertIn('balance_score', analysis)
        self.assertIn('balance_percentage', analysis)
        self.assertIn('protein_percentage', analysis)
        self.assertIn('fat_percentage', analysis)
        self.assertIn('carbs_percentage', analysis)
        self.assertIn('total_fiber', analysis)
        self.assertIn('total_calories', analysis)
        self.assertIn('recommendations', analysis)
        
        # Test nilai
        self.assertGreaterEqual(analysis['balance_percentage'], 0)
        self.assertLessEqual(analysis['balance_percentage'], 100)
        
    def test_health_classification(self):
        """Test klasifikasi kesehatan"""
        # Test makanan diabetes-friendly
        diabetes_food = {
            'calories': 100, 'protein': 10, 'fat': 2, 'carbohydrates': 15,
            'fiber': 5, 'sugar': 3, 'sodium': 50, 'potassium': 300,
            'calcium': 100, 'iron': 2, 'vitamin_c': 25
        }
        
        # Train model dulu
        self.nutrition_analyzer.train_health_classifier()
        
        prediction = self.nutrition_analyzer.predict_health_category(diabetes_food)
        self.assertIn(prediction, ['normal', 'diabetes_friendly', 'heart_healthy', 'vegetarian'])
        
    def test_clustering(self):
        """Test clustering makanan"""
        cluster_analysis = self.nutrition_analyzer.cluster_foods()
        
        self.assertIsInstance(cluster_analysis, dict)
        self.assertGreater(len(cluster_analysis), 0)
        
        # Test struktur cluster
        for cluster_name, cluster_info in cluster_analysis.items():
            self.assertIn('count', cluster_info)
            self.assertIn('avg_calories', cluster_info)
            self.assertIn('avg_protein', cluster_info)
            self.assertIn('avg_fat', cluster_info)
            self.assertIn('avg_carbs', cluster_info)
            self.assertIn('categories', cluster_info)
            self.assertIn('foods', cluster_info)
            
    def test_data_preprocessing(self):
        """Test preprocessing data"""
        processed_data = self.nutrition_analyzer.preprocess_data()
        
        self.assertIsInstance(processed_data, pd.DataFrame)
        self.assertGreater(processed_data.shape[0], 1000)
        self.assertEqual(processed_data.shape[1], 11)  # 11 feature columns
        
        # Test tidak ada missing values
        self.assertFalse(processed_data.isnull().any().any())
        
    def test_model_saving_loading(self):
        """Test save dan load model"""
        # Train model
        self.nutrition_analyzer.train_health_classifier()
        
        # Save model
        self.nutrition_analyzer.save_models()
        
        # Load model
        self.nutrition_analyzer.load_models()
        
        # Test prediksi setelah load
        test_food = {
            'calories': 150, 'protein': 15, 'fat': 5, 'carbohydrates': 20,
            'fiber': 4, 'sugar': 5, 'sodium': 100, 'potassium': 250,
            'calcium': 80, 'iron': 1.5, 'vitamin_c': 20
        }
        
        prediction = self.nutrition_analyzer.predict_health_category(test_food)
        self.assertIn(prediction, ['normal', 'diabetes_friendly', 'heart_healthy', 'vegetarian'])
        
    def test_recommendation_history(self):
        """Test riwayat rekomendasi"""
        # Test save
        user_input = {
            'available_ingredients': ['Beras Merah', 'Ayam Dada'],
            'health_conditions': ['diabetes'],
            'meal_type': 'lunch'
        }
        
        test_recommendations = [
            {
                'meal_type': 'lunch',
                'foods': [{'food_name': 'Beras Merah'}],
                'total_calories': 200
            }
        ]
        
        self.expert_system.save_recommendation_history(user_input, test_recommendations)
        
        # Test load
        history = self.expert_system.get_recommendation_history()
        self.assertIsInstance(history, list)
        
    def test_edge_cases(self):
        """Test edge cases"""
        # Test dengan bahan kosong
        empty_ingredients = []
        health_conditions = ['diabetes']
        
        meal_plans = self.expert_system.generate_meal_plans(
            empty_ingredients, health_conditions, 'lunch'
        )
        
        self.assertEqual(len(meal_plans), 0)
        
        # Test dengan kondisi kesehatan kosong
        available_ingredients = ['Beras Merah', 'Ayam Dada']
        empty_conditions = []
        
        meal_plans = self.expert_system.generate_meal_plans(
            available_ingredients, empty_conditions, 'lunch'
        )
        
        # Seharusnya masih bisa generate meal plan dengan aturan umum
        self.assertIsInstance(meal_plans, list)
        
    def test_performance(self):
        """Test performance"""
        import time
        
        # Test waktu generate meal plan
        available_ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel', 'Tahu']
        health_conditions = ['diabetes', 'hypertension']
        
        start_time = time.time()
        meal_plans = self.expert_system.generate_meal_plans(
            available_ingredients, health_conditions, 'lunch'
        )
        end_time = time.time()
        
        execution_time = end_time - start_time
        self.assertLess(execution_time, 5.0)  # Harus selesai dalam 5 detik
        
        # Test waktu analisis nutrisi
        if meal_plans:
            start_time = time.time()
            analysis = self.nutrition_analyzer.analyze_nutritional_balance(meal_plans[0])
            end_time = time.time()
            
            execution_time = end_time - start_time
            self.assertLess(execution_time, 1.0)  # Harus selesai dalam 1 detik

def run_integration_test():
    """Test integrasi sistem"""
    print("🧪 Menjalankan Integration Test...")
    
    # Setup
    expert_system = ForwardChainingExpertSystem()
    nutrition_analyzer = NutritionAnalyzer()
    
    # Test case 1: Diabetes
    print("\n📋 Test Case 1: Diabetes")
    ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel']
    conditions = ['diabetes']
    
    meal_plans = expert_system.generate_meal_plans(ingredients, conditions, 'lunch')
    print(f"✅ Generated {len(meal_plans)} meal plans")
    
    if meal_plans:
        analysis = nutrition_analyzer.analyze_nutritional_balance(meal_plans[0])
        print(f"✅ Balance score: {analysis['balance_percentage']:.0f}%")
    
    # Test case 2: Hipertensi
    print("\n📋 Test Case 2: Hipertensi")
    ingredients = ['Oatmeal', 'Yogurt Greek', 'Pisang', 'Kacang Almond']
    conditions = ['hypertension']
    
    meal_plans = expert_system.generate_meal_plans(ingredients, conditions, 'breakfast')
    print(f"✅ Generated {len(meal_plans)} meal plans")
    
    if meal_plans:
        analysis = nutrition_analyzer.analyze_nutritional_balance(meal_plans[0])
        print(f"✅ Balance score: {analysis['balance_percentage']:.0f}%")
    
    # Test case 3: Obesitas
    print("\n📋 Test Case 3: Obesitas")
    ingredients = ['Tahu', 'Tempe', 'Bayam', 'Wortel']
    conditions = ['obesity']
    
    meal_plans = expert_system.generate_meal_plans(ingredients, conditions, 'dinner')
    print(f"✅ Generated {len(meal_plans)} meal plans")
    
    if meal_plans:
        analysis = nutrition_analyzer.analyze_nutritional_balance(meal_plans[0])
        print(f"✅ Balance score: {analysis['balance_percentage']:.0f}%")
    
    print("\n🎉 Integration test selesai!")

if __name__ == "__main__":
    # Jalankan unit tests
    print("🧪 Menjalankan Unit Tests...")
    unittest.main(argv=[''], exit=False, verbosity=2)
    
    # Jalankan integration test
    run_integration_test() 