#!/usr/bin/env python3
"""
Script untuk training dan testing model machine learning
"""

import pandas as pd
import numpy as np
from ml_models.nutrition_analyzer import NutritionAnalyzer
from expert_system.forward_chaining import ForwardChainingExpertSystem
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

def main():
    print("🚀 Memulai training model NutriSuggest...")
    
    # Inisialisasi analyzer
    analyzer = NutritionAnalyzer()
    
    # 1. Preprocessing data
    print("📊 Preprocessing data...")
    processed_data = analyzer.preprocess_data()
    print(f"✅ Data berhasil diproses: {processed_data.shape}")
    
    # 2. Clustering makanan
    print("🔍 Melakukan clustering makanan...")
    cluster_analysis = analyzer.cluster_foods()
    print("✅ Clustering selesai!")
    
    # Tampilkan hasil clustering
    print("\n📈 Hasil Clustering:")
    for cluster_name, cluster_info in cluster_analysis.items():
        print(f"\n{cluster_name}:")
        print(f"  - Jumlah makanan: {cluster_info['count']}")
        print(f"  - Rata-rata kalori: {cluster_info['avg_calories']:.1f}")
        print(f"  - Rata-rata protein: {cluster_info['avg_protein']:.1f}g")
        print(f"  - Kategori dominan: {list(cluster_info['categories'].keys())[:3]}")
    
    # 3. Training classifier
    print("\n🤖 Training health classifier...")
    accuracy = analyzer.train_health_classifier()
    print(f"✅ Accuracy model: {accuracy:.3f}")
    
    # 4. Test prediksi
    print("\n🧪 Testing prediksi...")
    test_foods = [
        {
            'calories': 150, 'protein': 20, 'fat': 5, 'carbohydrates': 15,
            'fiber': 3, 'sugar': 2, 'sodium': 50, 'potassium': 300,
            'calcium': 100, 'iron': 2, 'vitamin_c': 25
        },
        {
            'calories': 400, 'protein': 10, 'fat': 25, 'carbohydrates': 35,
            'fiber': 1, 'sugar': 15, 'sodium': 300, 'potassium': 100,
            'calcium': 50, 'iron': 1, 'vitamin_c': 5
        }
    ]
    
    for i, food in enumerate(test_foods):
        prediction = analyzer.predict_health_category(food)
        print(f"Test food {i+1}: {prediction}")
    
    # 5. Test sistem pakar
    print("\n🧠 Testing sistem pakar...")
    expert_system = ForwardChainingExpertSystem()
    
    # Test dengan data dummy
    available_ingredients = ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel']
    health_conditions = ['diabetes', 'hypertension']
    
    meal_plans = expert_system.generate_meal_plans(
        available_ingredients, health_conditions, 'lunch'
    )
    
    print(f"✅ Berhasil generate {len(meal_plans)} rencana makan")
    
    # 6. Analisis nutrisi
    print("\n📊 Analisis nutrisi...")
    for i, plan in enumerate(meal_plans):
        analysis = analyzer.analyze_nutritional_balance(plan)
        print(f"\nRencana {i+1}:")
        print(f"  - Kalori: {plan['total_calories']:.0f} kcal")
        print(f"  - Protein: {plan['total_protein']:.1f}g")
        print(f"  - Keseimbangan: {analysis['balance_percentage']:.0f}%")
    
    # 7. Simpan model
    print("\n💾 Menyimpan model...")
    analyzer.save_models()
    print("✅ Model berhasil disimpan!")
    
    # 8. Visualisasi
    print("\n📈 Membuat visualisasi...")
    create_visualizations(analyzer)
    print("✅ Visualisasi berhasil dibuat!")
    
    print("\n🎉 Training selesai! Model siap digunakan.")

def create_visualizations(analyzer):
    """Membuat visualisasi untuk analisis"""
    
    # Load data
    data = analyzer.data
    
    # 1. Distribusi nutrisi
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    
    # Kalori
    axes[0, 0].hist(data['calories'], bins=20, alpha=0.7, color='skyblue')
    axes[0, 0].set_title('Distribusi Kalori')
    axes[0, 0].set_xlabel('Kalori')
    axes[0, 0].set_ylabel('Frekuensi')
    
    # Protein
    axes[0, 1].hist(data['protein'], bins=20, alpha=0.7, color='lightcoral')
    axes[0, 1].set_title('Distribusi Protein')
    axes[0, 1].set_xlabel('Protein (g)')
    axes[0, 1].set_ylabel('Frekuensi')
    
    # Lemak
    axes[0, 2].hist(data['fat'], bins=20, alpha=0.7, color='lightgreen')
    axes[0, 2].set_title('Distribusi Lemak')
    axes[0, 2].set_xlabel('Lemak (g)')
    axes[0, 2].set_ylabel('Frekuensi')
    
    # Karbohidrat
    axes[1, 0].hist(data['carbohydrates'], bins=20, alpha=0.7, color='gold')
    axes[1, 0].set_title('Distribusi Karbohidrat')
    axes[1, 0].set_xlabel('Karbohidrat (g)')
    axes[1, 0].set_ylabel('Frekuensi')
    
    # Serat
    axes[1, 1].hist(data['fiber'], bins=20, alpha=0.7, color='plum')
    axes[1, 1].set_title('Distribusi Serat')
    axes[1, 1].set_xlabel('Serat (g)')
    axes[1, 1].set_ylabel('Frekuensi')
    
    # Gula
    axes[1, 2].hist(data['sugar'], bins=20, alpha=0.7, color='orange')
    axes[1, 2].set_title('Distribusi Gula')
    axes[1, 2].set_xlabel('Gula (g)')
    axes[1, 2].set_ylabel('Frekuensi')
    
    plt.tight_layout()
    plt.savefig('nutrition_distributions.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. Scatter plot kalori vs protein
    plt.figure(figsize=(10, 8))
    plt.scatter(data['calories'], data['protein'], alpha=0.6, c=data['cluster'], cmap='viridis')
    plt.colorbar(label='Cluster')
    plt.xlabel('Kalori')
    plt.ylabel('Protein (g)')
    plt.title('Kalori vs Protein (dengan Clustering)')
    plt.savefig('calories_vs_protein.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 3. Box plot nutrisi per kategori
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # Kalori per kategori
    data.boxplot(column='calories', by='category', ax=axes[0, 0])
    axes[0, 0].set_title('Kalori per Kategori')
    axes[0, 0].set_xlabel('Kategori')
    axes[0, 0].set_ylabel('Kalori')
    
    # Protein per kategori
    data.boxplot(column='protein', by='category', ax=axes[0, 1])
    axes[0, 1].set_title('Protein per Kategori')
    axes[0, 1].set_xlabel('Kategori')
    axes[0, 1].set_ylabel('Protein (g)')
    
    # Serat per kategori
    data.boxplot(column='fiber', by='category', ax=axes[1, 0])
    axes[1, 0].set_title('Serat per Kategori')
    axes[1, 0].set_xlabel('Kategori')
    axes[1, 0].set_ylabel('Serat (g)')
    
    # Gula per kategori
    data.boxplot(column='sugar', by='category', ax=axes[1, 1])
    axes[1, 1].set_title('Gula per Kategori')
    axes[1, 1].set_xlabel('Kategori')
    axes[1, 1].set_ylabel('Gula (g)')
    
    plt.tight_layout()
    plt.savefig('nutrition_by_category.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 4. Heatmap korelasi
    numeric_cols = ['calories', 'protein', 'fat', 'carbohydrates', 'fiber', 'sugar']
    correlation_matrix = data[numeric_cols].corr()
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0,
                square=True, linewidths=0.5)
    plt.title('Korelasi Antar Nutrisi')
    plt.tight_layout()
    plt.savefig('nutrition_correlation.png', dpi=300, bbox_inches='tight')
    plt.close()

def test_expert_system():
    """Test sistem pakar"""
    print("\n🧠 Testing Sistem Pakar...")
    
    expert_system = ForwardChainingExpertSystem()
    
    # Test cases
    test_cases = [
        {
            'ingredients': ['Beras Merah', 'Ayam Dada', 'Brokoli', 'Apel'],
            'conditions': ['diabetes'],
            'meal_type': 'lunch'
        },
        {
            'ingredients': ['Oatmeal', 'Yogurt Greek', 'Pisang', 'Kacang Almond'],
            'conditions': ['hypertension'],
            'meal_type': 'breakfast'
        },
        {
            'ingredients': ['Tahu', 'Tempe', 'Bayam', 'Wortel'],
            'conditions': ['obesity'],
            'meal_type': 'dinner'
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        print(f"\nTest Case {i+1}:")
        print(f"  Bahan: {test_case['ingredients']}")
        print(f"  Kondisi: {test_case['conditions']}")
        print(f"  Jenis makan: {test_case['meal_type']}")
        
        meal_plans = expert_system.generate_meal_plans(
            test_case['ingredients'],
            test_case['conditions'],
            test_case['meal_type']
        )
        
        print(f"  Hasil: {len(meal_plans)} rencana makan")
        
        if meal_plans:
            plan = meal_plans[0]
            print(f"  Contoh rencana:")
            for food in plan['foods']:
                print(f"    - {food['food_name']}")
            print(f"  Total kalori: {plan['total_calories']:.0f} kcal")

if __name__ == "__main__":
    main()
    test_expert_system() 