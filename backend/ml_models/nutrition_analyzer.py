import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from typing import List, Dict, Tuple
import warnings
warnings.filterwarnings('ignore')

class NutritionAnalyzer:
    """
    Analisis nutrisi menggunakan machine learning
    """
    
    def __init__(self, data_path: str = "data/food_dataset.csv"):
        self.data = pd.read_csv(data_path)
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=3)
        self.kmeans = KMeans(n_clusters=5, random_state=42)
        self.rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.feature_columns = ['calories', 'protein', 'fat', 'carbohydrates', 
                               'fiber', 'sugar', 'sodium', 'potassium', 
                               'calcium', 'iron', 'vitamin_c']
        
    def preprocess_data(self) -> pd.DataFrame:
        """
        Preprocessing data nutrisi
        """
        # Pilih kolom numerik
        numeric_data = self.data[self.feature_columns].copy()
        
        # Handle missing values
        numeric_data = numeric_data.fillna(numeric_data.mean())
        
        # Normalisasi data
        scaled_data = self.scaler.fit_transform(numeric_data)
        
        return pd.DataFrame(scaled_data, columns=self.feature_columns)
    
    def cluster_foods(self) -> Dict:
        """
        Clustering makanan berdasarkan nutrisi
        """
        processed_data = self.preprocess_data()
        
        # Lakukan clustering
        clusters = self.kmeans.fit_predict(processed_data)
        
        # Tambahkan cluster ke data asli
        self.data['cluster'] = clusters
        
        # Analisis cluster
        cluster_analysis = {}
        for cluster_id in range(5):
            cluster_foods = self.data[self.data['cluster'] == cluster_id]
            cluster_analysis[f'cluster_{cluster_id}'] = {
                'count': len(cluster_foods),
                'avg_calories': cluster_foods['calories'].mean(),
                'avg_protein': cluster_foods['protein'].mean(),
                'avg_fat': cluster_foods['fat'].mean(),
                'avg_carbs': cluster_foods['carbohydrates'].mean(),
                'categories': cluster_foods['category'].value_counts().to_dict(),
                'foods': cluster_foods['food_name'].tolist()
            }
        
        return cluster_analysis
    
    def train_health_classifier(self) -> float:
        """
        Training classifier untuk klasifikasi kesehatan
        """
        # Buat target berdasarkan health_labels
        health_mapping = {
            'normal': 0,
            'diabetes_friendly': 1,
            'heart_healthy': 2,
            'vegetarian': 3
        }
        
        self.data['health_class'] = self.data['health_labels'].map(health_mapping)
        
        # Pilih data yang memiliki health_class yang valid
        valid_data = self.data[self.data['health_class'].notna()]
        
        X = valid_data[self.feature_columns]
        y = valid_data['health_class']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.rf_classifier.fit(X_train, y_train)
        
        # Predict dan evaluasi
        y_pred = self.rf_classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        return accuracy
    
    def predict_health_category(self, food_data: Dict) -> str:
        """
        Prediksi kategori kesehatan untuk makanan
        """
        # Buat DataFrame dari input
        input_df = pd.DataFrame([food_data])
        
        # Pilih feature yang diperlukan
        features = input_df[self.feature_columns]
        
        # Prediksi
        prediction = self.rf_classifier.predict(features)[0]
        
        # Map kembali ke label
        reverse_mapping = {
            0: 'normal',
            1: 'diabetes_friendly',
            2: 'heart_healthy',
            3: 'vegetarian'
        }
        
        return reverse_mapping.get(prediction, 'normal')
    
    def analyze_nutritional_balance(self, meal_plan: Dict) -> Dict:
        """
        Analisis keseimbangan nutrisi untuk rencana makan
        """
        total_calories = meal_plan['total_calories']
        total_protein = meal_plan['total_protein']
        total_fat = meal_plan['total_fat']
        total_carbs = meal_plan['total_carbs']
        total_fiber = meal_plan['total_fiber']
        
        # Hitung persentase makronutrien
        if total_calories > 0:
            protein_pct = (total_protein * 4 / total_calories) * 100
            fat_pct = (total_fat * 9 / total_calories) * 100
            carbs_pct = (total_carbs * 4 / total_calories) * 100
        else:
            protein_pct = fat_pct = carbs_pct = 0
        
        # Evaluasi keseimbangan
        balance_score = 0
        recommendations = []
        
        # Protein (10-35% dari kalori)
        if 10 <= protein_pct <= 35:
            balance_score += 1
        else:
            recommendations.append(f"Protein: {protein_pct:.1f}% (target: 10-35%)")
        
        # Lemak (20-35% dari kalori)
        if 20 <= fat_pct <= 35:
            balance_score += 1
        else:
            recommendations.append(f"Lemak: {fat_pct:.1f}% (target: 20-35%)")
        
        # Karbohidrat (45-65% dari kalori)
        if 45 <= carbs_pct <= 65:
            balance_score += 1
        else:
            recommendations.append(f"Karbohidrat: {carbs_pct:.1f}% (target: 45-65%)")
        
        # Serat (minimal 25g per hari)
        if total_fiber >= 5:  # Minimal 5g per makan
            balance_score += 1
        else:
            recommendations.append(f"Serat: {total_fiber:.1f}g (target: minimal 5g)")
        
        # Kalori (sesuai kebutuhan)
        if 300 <= total_calories <= 800:  # Range normal per makan
            balance_score += 1
        else:
            recommendations.append(f"Kalori: {total_calories:.0f} (target: 300-800)")
        
        balance_percentage = (balance_score / 5) * 100
        
        return {
            'balance_score': balance_score,
            'balance_percentage': balance_percentage,
            'protein_percentage': protein_pct,
            'fat_percentage': fat_pct,
            'carbs_percentage': carbs_pct,
            'total_fiber': total_fiber,
            'total_calories': total_calories,
            'recommendations': recommendations
        }
    
    def create_nutrition_visualization(self, meal_plans: List[Dict]) -> None:
        """
        Membuat visualisasi nutrisi
        """
        if not meal_plans:
            return
        
        # Data untuk visualisasi
        calories = [plan['total_calories'] for plan in meal_plans]
        proteins = [plan['total_protein'] for plan in meal_plans]
        fats = [plan['total_fat'] for plan in meal_plans]
        carbs = [plan['total_carbs'] for plan in meal_plans]
        
        # Buat subplot
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Distribusi Kalori
        axes[0, 0].hist(calories, bins=10, alpha=0.7, color='skyblue')
        axes[0, 0].set_title('Distribusi Kalori')
        axes[0, 0].set_xlabel('Kalori')
        axes[0, 0].set_ylabel('Frekuensi')
        
        # 2. Makronutrien per Rencana Makan
        x = range(len(meal_plans))
        width = 0.25
        axes[0, 1].bar([i - width for i in x], proteins, width, label='Protein', alpha=0.7)
        axes[0, 1].bar(x, fats, width, label='Lemak', alpha=0.7)
        axes[0, 1].bar([i + width for i in x], carbs, width, label='Karbohidrat', alpha=0.7)
        axes[0, 1].set_title('Makronutrien per Rencana Makan')
        axes[0, 1].set_xlabel('Rencana Makan')
        axes[0, 1].set_ylabel('Gram')
        axes[0, 1].legend()
        
        # 3. Pie chart rata-rata makronutrien
        avg_protein = np.mean(proteins)
        avg_fat = np.mean(fats)
        avg_carbs = np.mean(carbs)
        
        labels = ['Protein', 'Lemak', 'Karbohidrat']
        sizes = [avg_protein, avg_fat, avg_carbs]
        colors = ['lightcoral', 'lightblue', 'lightgreen']
        
        axes[1, 0].pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
        axes[1, 0].set_title('Rata-rata Distribusi Makronutrien')
        
        # 4. Scatter plot Kalori vs Protein
        axes[1, 1].scatter(calories, proteins, alpha=0.6, color='red')
        axes[1, 1].set_title('Kalori vs Protein')
        axes[1, 1].set_xlabel('Kalori')
        axes[1, 1].set_ylabel('Protein (g)')
        
        plt.tight_layout()
        plt.savefig('nutrition_analysis.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def save_models(self, model_path: str = "models/"):
        """
        Menyimpan model yang telah dilatih
        """
        import os
        os.makedirs(model_path, exist_ok=True)
        
        joblib.dump(self.scaler, f"{model_path}scaler.pkl")
        joblib.dump(self.kmeans, f"{model_path}kmeans.pkl")
        joblib.dump(self.rf_classifier, f"{model_path}rf_classifier.pkl")
    
    def load_models(self, model_path: str = "models/"):
        """
        Memuat model yang telah disimpan
        """
        self.scaler = joblib.load(f"{model_path}scaler.pkl")
        self.kmeans = joblib.load(f"{model_path}kmeans.pkl")
        self.rf_classifier = joblib.load(f"{model_path}rf_classifier.pkl") 