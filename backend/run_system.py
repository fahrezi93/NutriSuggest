#!/usr/bin/env python3
"""
Script untuk menjalankan sistem NutriSuggest secara langsung
Tanpa interface Streamlit
"""

import pandas as pd
import numpy as np
from expert_system.forward_chaining import ForwardChainingExpertSystem
from ml_models.nutrition_analyzer import NutritionAnalyzer
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

def print_menu():
    """Print menu utama"""
    print("\n" + "="*60)
    print("🥗 NUTRISUGGEST - SISTEM REKOMENDASI MAKANAN SEHAT")
    print("="*60)
    print("1. Lihat Dataset Makanan")
    print("2. Generate Rekomendasi Makanan")
    print("3. Analisis Nutrisi")
    print("4. Test Sistem Pakar")
    print("5. Test Machine Learning")
    print("6. Visualisasi Data")
    print("7. Riwayat Rekomendasi")
    print("8. Demo Lengkap")
    print("0. Keluar")
    print("="*60)

def show_dataset():
    """Tampilkan dataset makanan"""
    print("\n📊 DATASET MAKANAN")
    print("-" * 40)
    
    food_data = pd.read_csv("data/food_dataset.csv")
    
    print(f"Total makanan: {len(food_data)}")
    print(f"Kategori: {food_data['category'].unique()}")
    print(f"Label kesehatan: {food_data['health_labels'].unique()}")
    
    print("\n📋 Daftar Makanan:")
    for i, (_, row) in enumerate(food_data.iterrows(), 1):
        print(f"{i:2d}. {row['food_name']:<15} | {row['category']:<10} | {row['health_labels']}")
    
    print(f"\n📈 Statistik Nutrisi:")
    print(f"Rata-rata kalori: {food_data['calories'].mean():.1f} kcal")
    print(f"Rata-rata protein: {food_data['protein'].mean():.1f} g")
    print(f"Rata-rata serat: {food_data['fiber'].mean():.1f} g")
    print(f"Rata-rata gula: {food_data['sugar'].mean():.1f} g")

def generate_recommendation():
    """Generate rekomendasi makanan"""
    print("\n🍽️ GENERATE REKOMENDASI MAKANAN")
    print("-" * 40)
    
    # Load data untuk pilihan
    food_data = pd.read_csv("data/food_dataset.csv")
    
    print("Pilih bahan makanan yang tersedia (nomor, pisahkan dengan koma):")
    for i, (_, row) in enumerate(food_data.iterrows(), 1):
        print(f"{i:2d}. {row['food_name']}")
    
    try:
        choices = input("\nMasukkan nomor (contoh: 1,3,5,7): ").strip()
        selected_indices = [int(x.strip()) - 1 for x in choices.split(',')]
        available_ingredients = [food_data.iloc[i]['food_name'] for i in selected_indices]
        
        print(f"\nBahan yang dipilih: {available_ingredients}")
        
        # Pilih kondisi kesehatan
        print("\nPilih kondisi kesehatan:")
        conditions = ['diabetes', 'hypertension', 'obesity', 'heart_health']
        for i, condition in enumerate(conditions, 1):
            print(f"{i}. {condition}")
        
        condition_choice = int(input("Masukkan nomor kondisi: ")) - 1
        health_conditions = [conditions[condition_choice]]
        
        # Pilih jenis makan
        meal_types = ['breakfast', 'lunch', 'dinner', 'snack']
        print("\nPilih jenis makan:")
        for i, meal_type in enumerate(meal_types, 1):
            print(f"{i}. {meal_type}")
        
        meal_choice = int(input("Masukkan nomor jenis makan: ")) - 1
        meal_type = meal_types[meal_choice]
        
        # Generate rekomendasi
        expert_system = ForwardChainingExpertSystem()
        nutrition_analyzer = NutritionAnalyzer()
        
        print(f"\n🔄 Generating rekomendasi...")
        meal_plans = expert_system.generate_meal_plans(
            available_ingredients, health_conditions, meal_type
        )
        
        if meal_plans:
            print(f"\n✅ Berhasil generate {len(meal_plans)} rencana makan!")
            
            for i, plan in enumerate(meal_plans, 1):
                print(f"\n🍽️ Rencana {i} - {plan['meal_type'].title()}")
                print(f"   Makanan: {[food['food_name'] for food in plan['foods']]}")
                print(f"   Kalori: {plan['total_calories']:.0f} kcal")
                print(f"   Protein: {plan['total_protein']:.1f} g")
                print(f"   Lemak: {plan['total_fat']:.1f} g")
                print(f"   Karbohidrat: {plan['total_carbs']:.1f} g")
                print(f"   Serat: {plan['total_fiber']:.1f} g")
                
                # Analisis nutrisi
                analysis = nutrition_analyzer.analyze_nutritional_balance(plan)
                print(f"   Keseimbangan: {analysis['balance_percentage']:.0f}%")
                
                if analysis['recommendations']:
                    print(f"   Saran perbaikan:")
                    for rec in analysis['recommendations']:
                        print(f"     • {rec}")
        else:
            print("❌ Tidak dapat generate rencana makan dengan bahan yang tersedia")
            
    except (ValueError, IndexError) as e:
        print(f"❌ Error: {e}")
        print("Pastikan input valid")

def analyze_nutrition():
    """Analisis nutrisi"""
    print("\n📊 ANALISIS NUTRISI")
    print("-" * 40)
    
    nutrition_analyzer = NutritionAnalyzer()
    
    # Training model
    print("🔄 Training model...")
    accuracy = nutrition_analyzer.train_health_classifier()
    print(f"✅ Accuracy: {accuracy:.3f}")
    
    # Clustering
    print("\n🔍 Melakukan clustering...")
    cluster_analysis = nutrition_analyzer.cluster_foods()
    
    print("📊 Hasil Clustering:")
    for cluster_name, cluster_info in cluster_analysis.items():
        print(f"\n{cluster_name}:")
        print(f"  Jumlah: {cluster_info['count']}")
        print(f"  Rata-rata kalori: {cluster_info['avg_calories']:.1f}")
        print(f"  Rata-rata protein: {cluster_info['avg_protein']:.1f}g")
        print(f"  Kategori: {list(cluster_info['categories'].keys())[:3]}")
    
    # Test prediksi
    print("\n🧪 Test Prediksi:")
    test_food = {
        'calories': 150, 'protein': 15, 'fat': 5, 'carbohydrates': 20,
        'fiber': 4, 'sugar': 5, 'sodium': 100, 'potassium': 250,
        'calcium': 80, 'iron': 1.5, 'vitamin_c': 20
    }
    
    prediction = nutrition_analyzer.predict_health_category(test_food)
    print(f"Prediksi kategori: {prediction}")

def test_expert_system():
    """Test sistem pakar"""
    print("\n🧠 TEST SISTEM PAKAR")
    print("-" * 40)
    
    expert_system = ForwardChainingExpertSystem()
    
    # Tampilkan aturan
    print("📋 Aturan Sistem Pakar:")
    for i, rule in enumerate(expert_system.rules[:3]):
        print(f"\nAturan {i+1}:")
        print(f"  Kondisi: {rule['condition']}")
        print(f"  Aksi: {rule['then']}")
        print(f"  Prioritas: {rule['priority']}")
        print(f"  Penjelasan: {rule['explanation']}")
    
    # Test cases
    test_cases = [
        {
            'name': 'Diabetes',
            'ingredients': ['Beras Merah', 'Ayam Dada', 'Brokoli'],
            'conditions': ['diabetes']
        },
        {
            'name': 'Hipertensi',
            'ingredients': ['Oatmeal', 'Yogurt Greek', 'Bayam'],
            'conditions': ['hypertension']
        }
    ]
    
    for test_case in test_cases:
        print(f"\n🧪 Test: {test_case['name']}")
        meal_plans = expert_system.generate_meal_plans(
            test_case['ingredients'],
            test_case['conditions'],
            'lunch'
        )
        print(f"  Hasil: {len(meal_plans)} rencana makan")

def test_machine_learning():
    """Test machine learning"""
    print("\n🤖 TEST MACHINE LEARNING")
    print("-" * 40)
    
    nutrition_analyzer = NutritionAnalyzer()
    
    # Training
    print("🔄 Training model...")
    accuracy = nutrition_analyzer.train_health_classifier()
    print(f"✅ Accuracy: {accuracy:.3f}")
    
    # Test predictions
    test_foods = [
        {
            'name': 'Diabetes-Friendly',
            'data': {
                'calories': 100, 'protein': 10, 'fat': 2, 'carbohydrates': 15,
                'fiber': 5, 'sugar': 3, 'sodium': 50, 'potassium': 300,
                'calcium': 100, 'iron': 2, 'vitamin_c': 25
            }
        },
        {
            'name': 'High-Calorie',
            'data': {
                'calories': 400, 'protein': 10, 'fat': 25, 'carbohydrates': 35,
                'fiber': 1, 'sugar': 15, 'sodium': 300, 'potassium': 100,
                'calcium': 50, 'iron': 1, 'vitamin_c': 5
            }
        }
    ]
    
    print("\n🧪 Test Prediksi:")
    for test_food in test_foods:
        prediction = nutrition_analyzer.predict_health_category(test_food['data'])
        print(f"  {test_food['name']}: {prediction}")

def visualize_data():
    """Visualisasi data"""
    print("\n📈 VISUALISASI DATA")
    print("-" * 40)
    
    nutrition_analyzer = NutritionAnalyzer()
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
    plt.savefig('system_visualization.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Visualisasi berhasil dibuat: system_visualization.png")

def show_history():
    """Tampilkan riwayat"""
    print("\n📚 RIWAYAT REKOMENDASI")
    print("-" * 40)
    
    expert_system = ForwardChainingExpertSystem()
    history = expert_system.get_recommendation_history()
    
    if not history:
        print("Belum ada riwayat rekomendasi.")
        return
    
    print(f"Total riwayat: {len(history)}")
    
    for i, record in enumerate(history, 1):
        print(f"\n📅 Record {i}:")
        print(f"  Waktu: {record['timestamp']}")
        print(f"  Jenis makan: {record['meal_type']}")
        print(f"  Bahan: {record['available_ingredients']}")
        print(f"  Kondisi: {record['health_conditions']}")
        print(f"  Jumlah rekomendasi: {len(record['recommendations'])}")

def run_full_demo():
    """Jalankan demo lengkap"""
    print("\n🎬 DEMO LENGKAP")
    print("-" * 40)
    
    # Import demo
    from demo import main as demo_main
    demo_main()

def main():
    """Main function"""
    while True:
        print_menu()
        
        try:
            choice = input("\nPilih menu (0-8): ").strip()
            
            if choice == '0':
                print("\n👋 Terima kasih telah menggunakan NutriSuggest!")
                break
            elif choice == '1':
                show_dataset()
            elif choice == '2':
                generate_recommendation()
            elif choice == '3':
                analyze_nutrition()
            elif choice == '4':
                test_expert_system()
            elif choice == '5':
                test_machine_learning()
            elif choice == '6':
                visualize_data()
            elif choice == '7':
                show_history()
            elif choice == '8':
                run_full_demo()
            else:
                print("❌ Pilihan tidak valid!")
                
        except KeyboardInterrupt:
            print("\n\n👋 Program dihentikan oleh user")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 