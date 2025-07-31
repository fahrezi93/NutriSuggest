import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import sys
import os

# Tambahkan path untuk import modul
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from expert_system.forward_chaining import ForwardChainingExpertSystem
from ml_models.nutrition_analyzer import NutritionAnalyzer

# Konfigurasi halaman
st.set_page_config(
    page_title="NutriSuggest - Rekomendasi Makanan Sehat",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS untuk styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #2E8B57;
        text-align: center;
        margin-bottom: 2rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #4682B4;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #2E8B57;
    }
    .recommendation-card {
        background-color: #e8f5e8;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        border-left: 4px solid #4CAF50;
    }
    .avoid-card {
        background-color: #ffe8e8;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        border-left: 4px solid #f44336;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_systems():
    """Load sistem pakar dan ML model"""
    expert_system = ForwardChainingExpertSystem()
    nutrition_analyzer = NutritionAnalyzer()
    
    # Train model jika belum ada
    try:
        nutrition_analyzer.load_models()
    except:
        st.info("Training model ML...")
        nutrition_analyzer.train_health_classifier()
        nutrition_analyzer.save_models()
    
    return expert_system, nutrition_analyzer

def main():
    # Header
    st.markdown('<h1 class="main-header">🥗 NutriSuggest</h1>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; font-size: 1.2rem; color: #666;">Sistem Rekomendasi Makanan Sehat dengan AI & Sistem Pakar</p>', unsafe_allow_html=True)
    
    # Load sistem
    expert_system, nutrition_analyzer = load_systems()
    
    # Sidebar
    st.sidebar.title("⚙️ Konfigurasi")
    
    # Input bahan makanan
    st.sidebar.subheader("📦 Bahan Makanan Tersedia")
    
    # Load data makanan untuk pilihan
    food_data = pd.read_csv("data/food_dataset.csv")
    available_foods = st.sidebar.multiselect(
        "Pilih bahan makanan yang tersedia:",
        options=food_data['food_name'].tolist(),
        default=food_data['food_name'].head(10).tolist()
    )
    
    # Input kondisi kesehatan
    st.sidebar.subheader("🏥 Kondisi Kesehatan")
    health_conditions = st.sidebar.multiselect(
        "Pilih kondisi kesehatan:",
        options=['diabetes', 'hypertension', 'obesity', 'heart_health'],
        help="Pilih kondisi kesehatan yang relevan"
    )
    
    # Jenis makan
    meal_type = st.sidebar.selectbox(
        "🍽️ Jenis Makan:",
        options=['breakfast', 'lunch', 'dinner', 'snack'],
        index=1
    )
    
    # Filter makanan
    st.sidebar.subheader("🔍 Filter")
    diet_type = st.sidebar.selectbox(
        "Diet:",
        options=['semua', 'vegetarian', 'non-vegetarian']
    )
    
    # Tombol generate rekomendasi
    if st.sidebar.button("🚀 Generate Rekomendasi", type="primary"):
        if not available_foods:
            st.error("❌ Pilih minimal satu bahan makanan!")
        elif not health_conditions:
            st.error("❌ Pilih minimal satu kondisi kesehatan!")
        else:
            generate_recommendations(expert_system, nutrition_analyzer, 
                                  available_foods, health_conditions, meal_type, diet_type)
    
    # Tab untuk fitur lain
    tab1, tab2, tab3, tab4 = st.tabs(["🏠 Beranda", "📊 Analisis Data", "📈 Visualisasi", "📚 Riwayat"])
    
    with tab1:
        show_home_tab()
    
    with tab2:
        show_data_analysis_tab(nutrition_analyzer)
    
    with tab3:
        show_visualization_tab(nutrition_analyzer)
    
    with tab4:
        show_history_tab(expert_system)

def generate_recommendations(expert_system, nutrition_analyzer, 
                           available_foods, health_conditions, meal_type, diet_type):
    """Generate rekomendasi makanan"""
    
    with st.spinner("🔄 Menghasilkan rekomendasi..."):
        # Filter makanan berdasarkan diet
        if diet_type == 'vegetarian':
            filtered_foods = [food for food in available_foods 
                            if food_data[food_data['food_name'] == food]['health_labels'].iloc[0] == 'vegetarian']
        elif diet_type == 'non-vegetarian':
            filtered_foods = [food for food in available_foods 
                            if food_data[food_data['food_name'] == food]['health_labels'].iloc[0] != 'vegetarian']
        else:
            filtered_foods = available_foods
        
        # Generate meal plans
        meal_plans = expert_system.generate_meal_plans(
            filtered_foods, health_conditions, meal_type
        )
        
        # Analisis nutrisi
        nutrition_analysis = []
        for plan in meal_plans:
            analysis = nutrition_analyzer.analyze_nutritional_balance(plan)
            nutrition_analysis.append(analysis)
        
        # Simpan ke history
        user_input = {
            'available_ingredients': available_foods,
            'health_conditions': health_conditions,
            'meal_type': meal_type
        }
        expert_system.save_recommendation_history(user_input, meal_plans)
        
        # Tampilkan hasil
        display_recommendations(meal_plans, nutrition_analysis, health_conditions)

def display_recommendations(meal_plans, nutrition_analysis, health_conditions):
    """Tampilkan rekomendasi"""
    
    st.success("✅ Rekomendasi berhasil dibuat!")
    
    # Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Rencana Makan", len(meal_plans))
    
    with col2:
        avg_calories = np.mean([plan['total_calories'] for plan in meal_plans])
        st.metric("Rata-rata Kalori", f"{avg_calories:.0f} kcal")
    
    with col3:
        avg_protein = np.mean([plan['total_protein'] for plan in meal_plans])
        st.metric("Rata-rata Protein", f"{avg_protein:.1f} g")
    
    with col4:
        avg_fiber = np.mean([plan['total_fiber'] for plan in meal_plans])
        st.metric("Rata-rata Serat", f"{avg_fiber:.1f} g")
    
    # Tampilkan rencana makan
    st.subheader("🍽️ Rencana Makan yang Direkomendasikan")
    
    for i, (plan, analysis) in enumerate(zip(meal_plans, nutrition_analysis)):
        with st.expander(f"Rencana {i+1} - {plan['meal_type'].title()}"):
            col1, col2 = st.columns([2, 1])
            
            with col1:
                st.markdown("**Makanan:**")
                for food in plan['foods']:
                    st.write(f"• {food['food_name']}")
                
                st.markdown("**Nutrisi Total:**")
                st.write(f"• Kalori: {plan['total_calories']:.0f} kcal")
                st.write(f"• Protein: {plan['total_protein']:.1f} g")
                st.write(f"• Lemak: {plan['total_fat']:.1f} g")
                st.write(f"• Karbohidrat: {plan['total_carbs']:.1f} g")
                st.write(f"• Serat: {plan['total_fiber']:.1f} g")
            
            with col2:
                # Balance score
                balance_color = "green" if analysis['balance_percentage'] >= 80 else "orange" if analysis['balance_percentage'] >= 60 else "red"
                st.markdown(f"**Keseimbangan Nutrisi:**")
                st.markdown(f"<div style='color: {balance_color}; font-size: 1.5rem; font-weight: bold;'>{analysis['balance_percentage']:.0f}%</div>", unsafe_allow_html=True)
                
                if analysis['recommendations']:
                    st.markdown("**Saran Perbaikan:**")
                    for rec in analysis['recommendations']:
                        st.write(f"• {rec}")

def show_home_tab():
    """Tab beranda"""
    st.markdown('<h2 class="sub-header">🏠 Selamat Datang di NutriSuggest</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 🎯 Fitur Utama
        
        **🥗 Rekomendasi Makanan Pintar**
        - Berdasarkan kondisi kesehatan
        - Menggunakan sistem pakar forward chaining
        - Analisis nutrisi yang seimbang
        
        **🤖 Machine Learning**
        - Klasifikasi makanan sehat
        - Clustering berdasarkan nutrisi
        - Prediksi kategori kesehatan
        
        **📊 Visualisasi Data**
        - Grafik nutrisi interaktif
        - Analisis keseimbangan makronutrien
        - Dashboard yang informatif
        """)
    
    with col2:
        st.markdown("""
        ### 🏥 Kondisi Kesehatan yang Didukung
        
        **🩸 Diabetes**
        - Makanan rendah gula
        - Tinggi serat
        - Indeks glikemik rendah
        
        **💓 Hipertensi**
        - Rendah sodium
        - Tinggi kalium
        - Baik untuk jantung
        
        **⚖️ Obesitas**
        - Rendah kalori
        - Tinggi serat
        - Protein seimbang
        
        **❤️ Kesehatan Jantung**
        - Lemak sehat
        - Antioksidan
        - Omega-3
        """)

def show_data_analysis_tab(nutrition_analyzer):
    """Tab analisis data"""
    st.markdown('<h2 class="sub-header">📊 Analisis Data Nutrisi</h2>', unsafe_allow_html=True)
    
    # Load data
    food_data = pd.read_csv("data/food_dataset.csv")
    
    # Statistik umum
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Makanan", len(food_data))
    
    with col2:
        st.metric("Rata-rata Kalori", f"{food_data['calories'].mean():.0f} kcal")
    
    with col3:
        st.metric("Rata-rata Protein", f"{food_data['protein'].mean():.1f} g")
    
    with col4:
        st.metric("Rata-rata Serat", f"{food_data['fiber'].mean():.1f} g")
    
    # Distribusi kategori
    st.subheader("📈 Distribusi Kategori Makanan")
    category_counts = food_data['category'].value_counts()
    
    fig = px.pie(values=category_counts.values, names=category_counts.index, 
                 title="Distribusi Kategori Makanan")
    st.plotly_chart(fig, use_container_width=True)
    
    # Heatmap korelasi nutrisi
    st.subheader("🔥 Korelasi Nutrisi")
    numeric_cols = ['calories', 'protein', 'fat', 'carbohydrates', 'fiber', 'sugar']
    correlation_matrix = food_data[numeric_cols].corr()
    
    fig = px.imshow(correlation_matrix, 
                    title="Korelasi Antar Nutrisi",
                    color_continuous_scale='RdBu')
    st.plotly_chart(fig, use_container_width=True)

def show_visualization_tab(nutrition_analyzer):
    """Tab visualisasi"""
    st.markdown('<h2 class="sub-header">📈 Visualisasi Nutrisi</h2>', unsafe_allow_html=True)
    
    # Load data
    food_data = pd.read_csv("data/food_dataset.csv")
    
    # Scatter plot kalori vs protein
    st.subheader("📊 Kalori vs Protein")
    fig = px.scatter(food_data, x='calories', y='protein', 
                     color='category', hover_data=['food_name'],
                     title="Hubungan Kalori dan Protein")
    st.plotly_chart(fig, use_container_width=True)
    
    # Box plot nutrisi per kategori
    st.subheader("📦 Distribusi Nutrisi per Kategori")
    nutrient = st.selectbox("Pilih nutrisi:", ['calories', 'protein', 'fat', 'carbohydrates', 'fiber'])
    
    fig = px.box(food_data, x='category', y=nutrient, 
                 title=f"Distribusi {nutrient.title()} per Kategori")
    st.plotly_chart(fig, use_container_width=True)
    
    # Top makanan berdasarkan nutrisi
    st.subheader("🏆 Top 10 Makanan")
    metric = st.selectbox("Berdasarkan:", ['calories', 'protein', 'fiber', 'vitamin_c'])
    
    top_foods = food_data.nlargest(10, metric)[['food_name', metric, 'category']]
    
    fig = px.bar(top_foods, x='food_name', y=metric, color='category',
                 title=f"Top 10 Makanan Berdasarkan {metric.title()}")
    fig.update_xaxes(tickangle=45)
    st.plotly_chart(fig, use_container_width=True)

def show_history_tab(expert_system):
    """Tab riwayat"""
    st.markdown('<h2 class="sub-header">📚 Riwayat Rekomendasi</h2>', unsafe_allow_html=True)
    
    # Ambil riwayat
    history = expert_system.get_recommendation_history()
    
    if not history:
        st.info("Belum ada riwayat rekomendasi.")
        return
    
    # Tampilkan riwayat
    for record in history:
        with st.expander(f"📅 {record['timestamp']} - {record['meal_type'].title()}"):
            col1, col2 = st.columns(2)
            
            with col1:
                st.write("**Bahan Tersedia:**")
                for ingredient in record['available_ingredients']:
                    st.write(f"• {ingredient}")
                
                st.write("**Kondisi Kesehatan:**")
                for condition in record['health_conditions']:
                    st.write(f"• {condition}")
            
            with col2:
                st.write("**Jumlah Rekomendasi:**")
                st.write(f"• {len(record['recommendations'])} rencana makan")

if __name__ == "__main__":
    main() 