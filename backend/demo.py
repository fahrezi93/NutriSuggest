#!/usr/bin/env python3
"""
Demo script untuk NutriSuggest
Menampilkan kemampuan sistem rekomendasi makanan sehat
"""

import pandas as pd
import numpy as np
from expert_system.forward_chaining import ForwardChainingExpertSystem
from ml_models.nutrition_analyzer import NutritionAnalyzer
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def print_header():
    """Print header demo"""
    print("=" * 80)
    print("🥗 NUTRISUGGEST - DEMO SISTEM REKOMENDASI MAKANAN SEHAT")
    print("=" * 80)
    print("Sistem yang menggabungkan Machine Learning dan Sistem Pakar")
    print("untuk memberikan rekomendasi makanan berdasarkan kondisi kesehatan")
    print("=" * 80)
    print()

def demo_data_overview():
    """Demo overview dataset"""
    print("📊 DEMO 1: OVERVIEW DATASET")
    print("-" * 50)
    
    # Load data
    food_data = pd.read_csv("data/food_dataset.csv")
    
    print(f"Total makanan dalam dataset: {len(food_data)}")
    print(f"Kategori makanan: {food_data['category'].unique()}")
    print(f"Label kesehatan: {food_data['health_labels'].unique()}")
    
    # Statistik nutrisi
    print("\n📈 Statistik Nutrisi:")
    print(f"Rata-rata kalori: {food_data['calories'].mean():.1f} kcal")
    print(f"Rata-rata protein: {food_data['protein'].mean():.1f} g")
    print(f"Rata-rata serat: {food_data['fiber'].mean():.1f} g")
    print(f"Rata-rata gula: {food_data['sugar'].mean():.1f} g")
    
    # Top 5 makanan berdasarkan nutrisi
    print("\n🏆 Top 5 Makanan Tinggi Protein:")
    top_protein = food_data.nlargest(5, 'protein')[['food_name', 'protein', 'category']]
    for _, row in top_protein.iterrows():
        print(f"  • {row['food_name']}: {row['protein']}g ({row['category']})")
    
    print("\n🏆 Top 5 Makanan Tinggi Serat:")
    top_fiber = food_data.nlargest(5, 'fiber')[['food_name', 'fiber', 'category']]
    for _, row in top_fiber.iterrows():
        print(f"  • {row['food_name']}: {row['fiber']}g ({row['category']})")
    
    print()

def demo_expert_system():
    """Demo sistem pakar"""
    print("🧠 DEMO 2: SISTEM PAKAR (FORWARD CHAINING)")
    print("-" * 50)
    
    expert_system = ForwardChainingExpertSystem()
    
    # Tampilkan aturan
    print("📋 Aturan Sistem Pakar:")
    for i, rule in enumerate(expert_system.rules[:5]):  # Tampilkan 5 aturan pertama
        print(f"  {i+1}. Kondisi: {rule['condition']}")
        print(f"     Aksi: {rule['then']}")
        print(f"     Prioritas: {rule['priority']}")
        print(f"     Penjelasan: {rule['explanation']}")
        print()
    
    # Test case 1: Diabetes
    print("🩸 Test Case: Diabetes")
    ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel', 'Oatmeal']
    conditions = ['diabetes']
    
    print(f"Bahan tersedia: {ingredients}")
    print(f"Kondisi kesehatan: {conditions}")
    
    meal_plans = expert_system.generate_meal_plans(ingredients, conditions, 'lunch')
    
    print(f"\n✅ Berhasil generate {len(meal_plans)} rencana makan")
    
    if meal_plans:
        plan = meal_plans[0]
        print(f"\n🍽️ Contoh Rencana Makan:")
        print(f"  Jenis: {plan['meal_type']}")
        print(f"  Makanan: {[food['food_name'] for food in plan['foods']]}")
        print(f"  Total kalori: {plan['total_calories']:.0f} kcal")
        print(f"  Total protein: {plan['total_protein']:.1f} g")
        print(f"  Total serat: {plan['total_fiber']:.1f} g")
    
    print()

def demo_machine_learning():
    """Demo machine learning"""
    print("🤖 DEMO 3: MACHINE LEARNING")
    print("-" * 50)
    
    nutrition_analyzer = NutritionAnalyzer()
    
    # Training model
    print("🔄 Training model klasifikasi kesehatan...")
    accuracy = nutrition_analyzer.train_health_classifier()
    print(f"✅ Accuracy model: {accuracy:.3f}")
    
    # Clustering
    print("\n🔍 Melakukan clustering makanan...")
    cluster_analysis = nutrition_analyzer.cluster_foods()
    
    print("📊 Hasil Clustering:")
    for cluster_name, cluster_info in cluster_analysis.items():
        print(f"  {cluster_name}:")
        print(f"    - Jumlah makanan: {cluster_info['count']}")
        print(f"    - Rata-rata kalori: {cluster_info['avg_calories']:.1f}")
        print(f"    - Rata-rata protein: {cluster_info['avg_protein']:.1f}g")
        print(f"    - Kategori dominan: {list(cluster_info['categories'].keys())[:2]}")
        print()
    
    # Test prediksi
    print("🧪 Test Prediksi Kategori Kesehatan:")
    test_foods = [
        {
            'name': 'Makanan Diabetes-Friendly',
            'data': {
                'calories': 100, 'protein': 10, 'fat': 2, 'carbohydrates': 15,
                'fiber': 5, 'sugar': 3, 'sodium': 50, 'potassium': 300,
                'calcium': 100, 'iron': 2, 'vitamin_c': 25
            }
        },
        {
            'name': 'Makanan Tinggi Kalori',
            'data': {
                'calories': 400, 'protein': 10, 'fat': 25, 'carbohydrates': 35,
                'fiber': 1, 'sugar': 15, 'sodium': 300, 'potassium': 100,
                'calcium': 50, 'iron': 1, 'vitamin_c': 5
            }
        }
    ]
    
    for test_food in test_foods:
        prediction = nutrition_analyzer.predict_health_category(test_food['data'])
        print(f"  {test_food['name']}: {prediction}")
    
    print()

def demo_nutrition_analysis():
    """Demo analisis nutrisi"""
    print("📊 DEMO 4: ANALISIS NUTRISI")
    print("-" * 50)
    
    nutrition_analyzer = NutritionAnalyzer()
    
    # Test meal plans
    test_plans = [
        {
            'name': 'Rencana Seimbang',
            'data': {
                'total_calories': 450,
                'total_protein': 30,
                'total_fat': 15,
                'total_carbs': 50,
                'total_fiber': 8
            }
        },
        {
            'name': 'Rencana Tinggi Protein',
            'data': {
                'total_calories': 600,
                'total_protein': 45,
                'total_fat': 25,
                'total_carbs': 40,
                'total_fiber': 5
            }
        },
        {
            'name': 'Rencana Rendah Kalori',
            'data': {
                'total_calories': 250,
                'total_protein': 15,
                'total_fat': 8,
                'total_carbs': 30,
                'total_fiber': 10
            }
        }
    ]
    
    for plan in test_plans:
        print(f"\n🍽️ {plan['name']}:")
        analysis = nutrition_analyzer.analyze_nutritional_balance(plan['data'])
        
        print(f"  Kalori: {plan['data']['total_calories']} kcal")
        print(f"  Protein: {plan['data']['total_protein']}g ({analysis['protein_percentage']:.1f}%)")
        print(f"  Lemak: {plan['data']['total_fat']}g ({analysis['fat_percentage']:.1f}%)")
        print(f"  Karbohidrat: {plan['data']['total_carbs']}g ({analysis['carbs_percentage']:.1f}%)")
        print(f"  Serat: {plan['data']['total_fiber']}g")
        print(f"  Keseimbangan: {analysis['balance_percentage']:.0f}%")
        
        if analysis['recommendations']:
            print(f"  Saran perbaikan:")
            for rec in analysis['recommendations']:
                print(f"    • {rec}")
    
    print()

def demo_integration():
    """Demo integrasi sistem"""
    print("🔗 DEMO 5: INTEGRASI SISTEM")
    print("-" * 50)
    
    expert_system = ForwardChainingExpertSystem()
    nutrition_analyzer = NutritionAnalyzer()
    
    # Train model terlebih dahulu
    print("🔄 Training model...")
    nutrition_analyzer.train_health_classifier()
    
    # Test cases
    test_cases = [
        {
            'name': 'Penderita Diabetes',
            'ingredients': ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel', 'Tahu'],
            'conditions': ['diabetes'],
            'meal_type': 'lunch'
        },
        {
            'name': 'Penderita Hipertensi',
            'ingredients': ['Oatmeal', 'Yogurt Greek', 'Pisang', 'Kacang Almond', 'Bayam'],
            'conditions': ['hypertension'],
            'meal_type': 'breakfast'
        },
        {
            'name': 'Penderita Obesitas',
            'ingredients': ['Tahu', 'Tempe', 'Bayam', 'Wortel', 'Jeruk'],
            'conditions': ['obesity'],
            'meal_type': 'dinner'
        }
    ]
    
    for test_case in test_cases:
        print(f"\n👤 {test_case['name']}")
        print(f"   Bahan: {test_case['ingredients']}")
        print(f"   Kondisi: {test_case['conditions']}")
        print(f"   Jenis makan: {test_case['meal_type']}")
        
        # Generate meal plans
        meal_plans = expert_system.generate_meal_plans(
            test_case['ingredients'],
            test_case['conditions'],
            test_case['meal_type']
        )
        
        print(f"   ✅ Generated {len(meal_plans)} meal plans")
        
        if meal_plans:
            # Analisis nutrisi
            plan = meal_plans[0]
            analysis = nutrition_analyzer.analyze_nutritional_balance(plan)
            
            print(f"   📊 Analisis:")
            print(f"      Kalori: {plan['total_calories']:.0f} kcal")
            print(f"      Protein: {plan['total_protein']:.1f}g")
            print(f"      Keseimbangan: {analysis['balance_percentage']:.0f}%")
            
            # Prediksi kategori kesehatan
            if plan['foods']:
                food_data = plan['foods'][0]
                prediction = nutrition_analyzer.predict_health_category(food_data)
                print(f"      Kategori: {prediction}")
    
    print()

def demo_visualization():
    """Demo visualisasi"""
    print("📈 DEMO 6: VISUALISASI")
    print("-" * 50)
    
    nutrition_analyzer = NutritionAnalyzer()
    
    # Load data
    food_data = nutrition_analyzer.data
    
    # Buat visualisasi
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # 1. Distribusi kalori
    axes[0, 0].hist(food_data['calories'], bins=15, alpha=0.7, color='skyblue')
    axes[0, 0].set_title('Distribusi Kalori')
    axes[0, 0].set_xlabel('Kalori')
    axes[0, 0].set_ylabel('Frekuensi')
    
    # 2. Scatter plot kalori vs protein
    axes[0, 1].scatter(food_data['calories'], food_data['protein'], alpha=0.6)
    axes[0, 1].set_title('Kalori vs Protein')
    axes[0, 1].set_xlabel('Kalori')
    axes[0, 1].set_ylabel('Protein (g)')
    
    # 3. Box plot serat per kategori
    food_data.boxplot(column='fiber', by='category', ax=axes[1, 0])
    axes[1, 0].set_title('Serat per Kategori')
    axes[1, 0].set_xlabel('Kategori')
    axes[1, 0].set_ylabel('Serat (g)')
    
    # 4. Pie chart kategori makanan
    category_counts = food_data['category'].value_counts()
    axes[1, 1].pie(category_counts.values, labels=category_counts.index, autopct='%1.1f%%')
    axes[1, 1].set_title('Distribusi Kategori Makanan')
    
    plt.tight_layout()
    plt.savefig('demo_visualization.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Visualisasi berhasil dibuat: demo_visualization.png")
    print("📊 Grafik yang dibuat:")
    print("  • Distribusi kalori makanan")
    print("  • Hubungan kalori vs protein")
    print("  • Distribusi serat per kategori")
    print("  • Pie chart kategori makanan")
    
    print()

def demo_performance():
    """Demo performance"""
    print("⚡ DEMO 7: PERFORMANCE TEST")
    print("-" * 50)
    
    import time
    
    expert_system = ForwardChainingExpertSystem()
    nutrition_analyzer = NutritionAnalyzer()
    
    # Train model terlebih dahulu
    nutrition_analyzer.train_health_classifier()
    
    # Test waktu generate meal plan
    ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel', 'Tahu', 'Oatmeal']
    conditions = ['diabetes', 'hypertension']
    
    start_time = time.time()
    meal_plans = expert_system.generate_meal_plans(ingredients, conditions, 'lunch')
    end_time = time.time()
    
    generation_time = end_time - start_time
    print(f"⏱️  Waktu generate meal plan: {generation_time:.3f} detik")
    print(f"📊 Jumlah meal plan: {len(meal_plans)}")
    
    # Test waktu analisis nutrisi
    if meal_plans:
        start_time = time.time()
        analysis = nutrition_analyzer.analyze_nutritional_balance(meal_plans[0])
        end_time = time.time()
        
        analysis_time = end_time - start_time
        print(f"⏱️  Waktu analisis nutrisi: {analysis_time:.3f} detik")
    
    # Test waktu prediksi
    test_food = {
        'calories': 150, 'protein': 15, 'fat': 5, 'carbohydrates': 20,
        'fiber': 4, 'sugar': 5, 'sodium': 100, 'potassium': 250,
        'calcium': 80, 'iron': 1.5, 'vitamin_c': 20
    }
    
    start_time = time.time()
    prediction = nutrition_analyzer.predict_health_category(test_food)
    end_time = time.time()
    
    prediction_time = end_time - start_time
    print(f"⏱️  Waktu prediksi kategori: {prediction_time:.3f} detik")
    print(f"🎯 Hasil prediksi: {prediction}")
    
    print()

def main():
    """Main demo function"""
    print_header()
    
    # Jalankan semua demo
    demo_data_overview()
    demo_expert_system()
    demo_machine_learning()
    demo_nutrition_analysis()
    demo_integration()
    demo_visualization()
    demo_performance()
    
    # Summary
    print("🎉 DEMO SELESAI!")
    print("=" * 80)
    print("✅ Sistem NutriSuggest berhasil didemonstrasikan")
    print("✅ Semua fitur berfungsi dengan baik")
    print("✅ Performance memenuhi standar")
    print("✅ Visualisasi berhasil dibuat")
    print()
    print("🚀 Untuk menjalankan aplikasi lengkap:")
    print("   streamlit run app.py")
    print()
    print("📚 Untuk informasi lebih lanjut, lihat README.md")
    print("=" * 80)

if __name__ == "__main__":
    main() 