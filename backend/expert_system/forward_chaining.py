import pandas as pd
import numpy as np
from typing import List, Dict, Tuple, Set
import sqlite3
from datetime import datetime

class ForwardChainingExpertSystem:
    """
    Sistem Pakar dengan Forward Chaining untuk Rekomendasi Makanan Sehat
    """
    
    def __init__(self, food_data_path: str = "data/food_dataset.csv"):
        self.food_data = pd.read_csv(food_data_path)
        self.rules = self._initialize_rules()
        self.working_memory = {}
        self.recommendations = []
        
    def _initialize_rules(self) -> List[Dict]:
        """
        Inisialisasi aturan-aturan sistem pakar
        """
        rules = [
            # Aturan untuk Diabetes
            {
                'condition': 'diabetes',
                'if': lambda food: food['sugar'] > 10 or food['carbohydrates'] > 25,
                'then': 'avoid',
                'priority': 1,
                'explanation': 'Makanan tinggi gula dan karbohidrat tidak baik untuk penderita diabetes'
            },
            {
                'condition': 'diabetes',
                'if': lambda food: food['fiber'] > 3 and food['sugar'] < 8,
                'then': 'recommend',
                'priority': 2,
                'explanation': 'Makanan tinggi serat dan rendah gula baik untuk penderita diabetes'
            },
            
            # Aturan untuk Hipertensi
            {
                'condition': 'hypertension',
                'if': lambda food: food['sodium'] > 200,
                'then': 'avoid',
                'priority': 1,
                'explanation': 'Makanan tinggi sodium tidak baik untuk penderita hipertensi'
            },
            {
                'condition': 'hypertension',
                'if': lambda food: food['potassium'] > 300 and food['sodium'] < 100,
                'then': 'recommend',
                'priority': 2,
                'explanation': 'Makanan tinggi kalium dan rendah sodium baik untuk penderita hipertensi'
            },
            
            # Aturan untuk Obesitas
            {
                'condition': 'obesity',
                'if': lambda food: food['calories'] > 200 or food['fat'] > 15,
                'then': 'avoid',
                'priority': 1,
                'explanation': 'Makanan tinggi kalori dan lemak tidak baik untuk penderita obesitas'
            },
            {
                'condition': 'obesity',
                'if': lambda food: food['fiber'] > 2 and food['calories'] < 100,
                'then': 'recommend',
                'priority': 2,
                'explanation': 'Makanan tinggi serat dan rendah kalori baik untuk penderita obesitas'
            },
            
            # Aturan untuk Jantung Sehat
            {
                'condition': 'heart_health',
                'if': lambda food: food['fat'] > 20 or food['sodium'] > 300,
                'then': 'avoid',
                'priority': 1,
                'explanation': 'Makanan tinggi lemak dan sodium tidak baik untuk kesehatan jantung'
            },
            {
                'condition': 'heart_health',
                'if': lambda food: food['fiber'] > 3 and food['fat'] < 10,
                'then': 'recommend',
                'priority': 2,
                'explanation': 'Makanan tinggi serat dan rendah lemak baik untuk kesehatan jantung'
            },
            
            # Aturan Umum
            {
                'condition': 'general',
                'if': lambda food: food['vitamin_c'] > 20,
                'then': 'recommend',
                'priority': 3,
                'explanation': 'Makanan tinggi vitamin C baik untuk sistem imun'
            },
            {
                'condition': 'general',
                'if': lambda food: food['iron'] > 2,
                'then': 'recommend',
                'priority': 3,
                'explanation': 'Makanan tinggi zat besi baik untuk kesehatan darah'
            }
        ]
        return rules
    
    def add_to_working_memory(self, key: str, value: any):
        """
        Menambahkan fakta ke working memory
        """
        self.working_memory[key] = value
    
    def get_available_foods(self, available_ingredients: List[str]) -> pd.DataFrame:
        """
        Mendapatkan data makanan yang tersedia
        """
        available_foods = self.food_data[self.food_data['food_name'].isin(available_ingredients)]
        return available_foods
    
    def apply_rules(self, food_data: pd.DataFrame, health_conditions: List[str]) -> Dict:
        """
        Menerapkan aturan forward chaining untuk setiap makanan
        """
        results = {
            'recommended': [],
            'avoid': [],
            'neutral': []
        }
        
        for _, food in food_data.iterrows():
            food_dict = food.to_dict()
            recommendations = []
            avoidances = []
            
            # Terapkan aturan untuk setiap kondisi kesehatan
            for condition in health_conditions:
                applicable_rules = [rule for rule in self.rules 
                                 if rule['condition'] in [condition, 'general']]
                
                for rule in applicable_rules:
                    if rule['if'](food_dict):
                        if rule['then'] == 'recommend':
                            recommendations.append({
                                'rule': rule,
                                'food': food_dict,
                                'score': rule['priority']
                            })
                        elif rule['then'] == 'avoid':
                            avoidances.append({
                                'rule': rule,
                                'food': food_dict,
                                'score': rule['priority']
                            })
            
            # Klasifikasikan makanan berdasarkan hasil aturan
            if avoidances:
                results['avoid'].append({
                    'food': food_dict,
                    'reasons': [a['rule']['explanation'] for a in avoidances]
                })
            elif recommendations:
                results['recommended'].append({
                    'food': food_dict,
                    'reasons': [r['rule']['explanation'] for r in recommendations],
                    'score': max([r['score'] for r in recommendations])
                })
            else:
                results['neutral'].append({
                    'food': food_dict,
                    'reasons': ['Tidak ada aturan khusus yang berlaku']
                })
        
        return results
    
    def generate_meal_plans(self, available_ingredients: List[str], 
                          health_conditions: List[str], 
                          meal_type: str = 'lunch') -> List[Dict]:
        """
        Menghasilkan rencana makan berdasarkan bahan yang tersedia
        """
        available_foods = self.get_available_foods(available_ingredients)
        rule_results = self.apply_rules(available_foods, health_conditions)
        
        meal_plans = []
        
        # Buat kombinasi makanan yang direkomendasikan
        recommended_foods = rule_results['recommended']
        
        # Kategorikan makanan berdasarkan kategori
        categories = {
            'grains': [],
            'protein': [],
            'vegetables': [],
            'fruits': [],
            'dairy': [],
            'nuts': [],
            'legumes': [],
            'oils': []
        }
        
        for food in recommended_foods:
            category = food['food']['category']
            if category in categories:
                categories[category].append(food)
        
        # Buat rencana makan yang seimbang
        meal_plans = self._create_balanced_meals(categories, meal_type)
        
        return meal_plans
    
    def _create_balanced_meals(self, categorized_foods: Dict, meal_type: str) -> List[Dict]:
        """
        Membuat rencana makan yang seimbang
        """
        meal_plans = []
        
        # Aturan komposisi berdasarkan jenis makan
        if meal_type == 'breakfast':
            composition = {
                'grains': 1,
                'protein': 1,
                'fruits': 1,
                'dairy': 1
            }
        elif meal_type == 'lunch':
            composition = {
                'grains': 1,
                'protein': 1,
                'vegetables': 2,
                'fruits': 1
            }
        elif meal_type == 'dinner':
            composition = {
                'grains': 1,
                'protein': 1,
                'vegetables': 2
            }
        else:
            composition = {
                'grains': 1,
                'protein': 1,
                'vegetables': 1,
                'fruits': 1
            }
        
        # Buat kombinasi makanan
        max_combinations = 5  # Maksimal 5 kombinasi
        combinations_created = 0
        
        for _ in range(max_combinations):
            meal_plan = {
                'meal_type': meal_type,
                'foods': [],
                'total_calories': 0,
                'total_protein': 0,
                'total_fat': 0,
                'total_carbs': 0,
                'total_fiber': 0
            }
            
            for category, count in composition.items():
                if category in categorized_foods and categorized_foods[category]:
                    # Pilih makanan secara acak dari kategori
                    selected_food = np.random.choice(categorized_foods[category])
                    meal_plan['foods'].append(selected_food['food'])
                    
                    # Update total nutrisi
                    meal_plan['total_calories'] += selected_food['food']['calories']
                    meal_plan['total_protein'] += selected_food['food']['protein']
                    meal_plan['total_fat'] += selected_food['food']['fat']
                    meal_plan['total_carbs'] += selected_food['food']['carbohydrates']
                    meal_plan['total_fiber'] += selected_food['food']['fiber']
            
            if meal_plan['foods']:
                meal_plans.append(meal_plan)
                combinations_created += 1
            
            if combinations_created >= max_combinations:
                break
        
        return meal_plans
    
    def save_recommendation_history(self, user_input: Dict, recommendations: List[Dict]):
        """
        Menyimpan riwayat rekomendasi ke database
        """
        conn = sqlite3.connect('recommendation_history.db')
        cursor = conn.cursor()
        
        # Buat tabel jika belum ada
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recommendation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME,
                available_ingredients TEXT,
                health_conditions TEXT,
                meal_type TEXT,
                recommendations TEXT
            )
        ''')
        
        # Simpan data
        cursor.execute('''
            INSERT INTO recommendation_history 
            (timestamp, available_ingredients, health_conditions, meal_type, recommendations)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            datetime.now(),
            str(user_input.get('available_ingredients', [])),
            str(user_input.get('health_conditions', [])),
            user_input.get('meal_type', 'lunch'),
            str(recommendations)
        ))
        
        conn.commit()
        conn.close()
    
    def get_recommendation_history(self) -> List[Dict]:
        """
        Mengambil riwayat rekomendasi dari database
        """
        conn = sqlite3.connect('recommendation_history.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM recommendation_history ORDER BY timestamp DESC LIMIT 10')
        rows = cursor.fetchall()
        
        history = []
        for row in rows:
            history.append({
                'id': row[0],
                'timestamp': row[1],
                'available_ingredients': eval(row[2]),
                'health_conditions': eval(row[3]),
                'meal_type': row[4],
                'recommendations': eval(row[5])
            })
        
        conn.close()
        return history 