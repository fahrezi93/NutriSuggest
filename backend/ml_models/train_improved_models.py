import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os

def load_and_clean_data(data_path):
    """Load dan clean dataset"""
    print(f"Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"Original dataset shape: {df.shape}")
    
    # Clean data
    numeric_cols = ['calories', 'proteins', 'fat', 'carbohydrate']
    df_clean = df[numeric_cols + ['name']].copy()
    df_clean = df_clean.dropna()
    
    # Remove outliers
    for col in numeric_cols:
        Q1 = df_clean[col].quantile(0.25)
        Q3 = df_clean[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df_clean = df_clean[(df_clean[col] >= lower) & (df_clean[col] <= upper)]
    
    print(f"Cleaned dataset shape: {df_clean.shape}")
    return df_clean

def train_regression_models(df_clean):
    """Train regression models untuk prediksi kalori"""
    print("\n=== Training Regression Models ===")
    
    X = df_clean[['proteins', 'fat', 'carbohydrate']]
    y = df_clean['calories']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    models = {
        'Linear Regression': LinearRegression(),
        'Ridge Regression': Ridge(alpha=1.0),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    }
    
    best_model = None
    best_score = -np.inf
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
        print(f"CV R²: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
        # Train and evaluate
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        test_r2 = r2_score(y_test, y_pred)
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        print(f"Test R²: {test_r2:.4f}")
        print(f"Test RMSE: {test_rmse:.2f}")
        
        if test_r2 > best_score:
            best_score = test_r2
            best_model = (name, model, scaler)
    
    return best_model

def train_classification_models(df_clean):
    """Train classification models untuk level kalori"""
    print("\n=== Training Classification Models ===")
    
    # Create calorie levels
    df_clean['calorie_level'] = pd.cut(df_clean['calories'], 
                                     bins=[0, 100, 300, 1000], 
                                     labels=['Low', 'Medium', 'High'])
    
    X = df_clean[['proteins', 'fat', 'carbohydrate']]
    y = df_clean['calorie_level']
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest classifier
    rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    
    # Cross-validation
    cv_scores = cross_val_score(rf_classifier, X_train_scaled, y_train, cv=5, scoring='accuracy')
    print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    # Train and evaluate
    rf_classifier.fit(X_train_scaled, y_train)
    y_pred = rf_classifier.predict(X_test_scaled)
    test_accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Test Accuracy: {test_accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    return rf_classifier, scaler, label_encoder

def hyperparameter_tuning(df_clean):
    """Hyperparameter tuning untuk model terbaik"""
    print("\n=== Hyperparameter Tuning ===")
    
    X = df_clean[['proteins', 'fat', 'carbohydrate']]
    y = df_clean['calories']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Grid search untuk Random Forest
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [5, 10, 15, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    rf = RandomForestRegressor(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='r2', n_jobs=-1)
    grid_search.fit(X_train_scaled, y_train)
    
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best CV score: {grid_search.best_score_:.4f}")
    
    # Evaluate best model
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test_scaled)
    test_r2 = r2_score(y_test, y_pred)
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"Best model test R²: {test_r2:.4f}")
    print(f"Best model test RMSE: {test_rmse:.2f}")
    
    return best_model, scaler

def save_models(regression_model, classification_model, regression_scaler, 
                classification_scaler, classification_encoder, output_dir="models/"):
    """Save semua model"""
    os.makedirs(output_dir, exist_ok=True)
    
    # Save regression model
    joblib.dump(regression_model, os.path.join(output_dir, "best_regression_model.pkl"))
    joblib.dump(regression_scaler, os.path.join(output_dir, "regression_scaler.pkl"))
    
    # Save classification model
    joblib.dump(classification_model, os.path.join(output_dir, "best_classification_model.pkl"))
    joblib.dump(classification_scaler, os.path.join(output_dir, "classification_scaler.pkl"))
    joblib.dump(classification_encoder, os.path.join(output_dir, "classification_encoder.pkl"))
    
    print(f"\nAll models saved to {output_dir}")

def main():
    """Main training function"""
    print("=== Improved Nutrition Model Training ===")
    
    # Load and clean data
    df_clean = load_and_clean_data("../../data/nutrition_sampled_500.csv")
    
    # Train regression models
    best_regression = train_regression_models(df_clean)
    
    # Train classification models
    classification_model, classification_scaler, classification_encoder = train_classification_models(df_clean)
    
    # Hyperparameter tuning
    tuned_model, tuned_scaler = hyperparameter_tuning(df_clean)
    
    # Save models
    save_models(tuned_model, classification_model, tuned_scaler, 
                classification_scaler, classification_encoder)
    
    print("\n=== Training Complete ===")
    print("All models trained and saved successfully!")

if __name__ == "__main__":
    main() 