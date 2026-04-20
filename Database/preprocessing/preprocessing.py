"""
=============================================================================
FITNESS AI — PREPROCESSING PIPELINE 
=============================================================================
"""

import pandas as pd
import joblib
from pathlib import Path


# =============================================================================
# PATH SETUP 
# =============================================================================

DATA_DIR = Path(r"C:\Users\sruth\OneDrive\Desktop\Fityntra\Database\preprocessing\data")

PREPROCESS_DIR = Path(r"C:\Users\sruth\OneDrive\Desktop\Fityntra\Database\preprocessed_data")

PREPROCESS_DIR.mkdir(parents=True, exist_ok=True)

print("\n DATA_DIR :", DATA_DIR)

if not DATA_DIR.exists():
    raise FileNotFoundError(f"\n DATA FOLDER NOT FOUND:\n{DATA_DIR}")

print(" FILES FOUND:", list(DATA_DIR.glob("*")))


# =============================================================================
# MODEL 1 — CALORIE PREPROCESSING
# =============================================================================

def preprocess_calorie():
    print("\n" + "="*50)
    print("PREPROCESSING: CALORIE DATA")
    print("="*50)

    df = pd.read_csv(DATA_DIR / "user_biometrics.csv")

    FEATURES = [
        "age","gender","weight_kg","height_cm","bmi",
        "body_fat_pct","activity_level","fitness_level",
        "goal","sleep_hrs","stress_level"
    ]

    TARGET = "target_calories"

    df = df[FEATURES + [TARGET]].dropna()

    X = pd.get_dummies(df[FEATURES])
    y = df[TARGET]

    joblib.dump(X, PREPROCESS_DIR / "calorie_X.pkl")
    joblib.dump(y, PREPROCESS_DIR / "calorie_y.pkl")
    joblib.dump(X.columns.tolist(), PREPROCESS_DIR / "calorie_features.pkl")

    print(" Calorie data preprocessed & saved")


# =============================================================================
# MODEL 2 — NUTRITION PREPROCESSING
# =============================================================================

def preprocess_nutrition():
    print("\n" + "="*50)
    print("PREPROCESSING: NUTRITION DATA")
    print("="*50)

    df = pd.read_csv(DATA_DIR / "indian_nutrition.csv")

    # Feature engineering
    df["protein_density"] = df["protein_g"] / (df["calories_per_100g"] + 1) * 100

    FEATURES = [
        "calories_per_100g","carbs_g","fat_g",
        "fiber_g","glycemic_index","region","is_vegan"
    ]

    TARGET = "protein_density"

    df = df[FEATURES + [TARGET]].dropna()

    X = pd.get_dummies(df[FEATURES])
    y = df[TARGET]

    joblib.dump(X, PREPROCESS_DIR / "nutrition_X.pkl")
    joblib.dump(y, PREPROCESS_DIR / "nutrition_y.pkl")
    joblib.dump(X.columns.tolist(), PREPROCESS_DIR / "nutrition_features.pkl")

    print(" Nutrition data preprocessed & saved")


# =============================================================================
# MODEL 3 — EXERCISE PREPROCESSING
# =============================================================================

def preprocess_exercise():
    print("\n" + "="*50)
    print("PREPROCESSING: EXERCISE DATA")
    print("="*50)

    df = pd.read_csv(DATA_DIR / "exercise_library.csv")
    df.columns = df.columns.str.lower()

    TARGET = "calorie_burn_30min"

    FEATURES = [
        "is_compound","is_bodyweight","met_value",
        "rest_seconds","category","equipment",
        "difficulty","primary_muscle"
    ]

    df = df[FEATURES + [TARGET]].dropna()

    X = pd.get_dummies(df[FEATURES])
    y = df[TARGET]

    joblib.dump(X, PREPROCESS_DIR / "exercise_X.pkl")
    joblib.dump(y, PREPROCESS_DIR / "exercise_y.pkl")
    joblib.dump(X.columns.tolist(), PREPROCESS_DIR / "exercise_features.pkl")

    print(" Exercise data preprocessed & saved")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":

    print("\n FITNESS AI PREPROCESSING STARTED")

    try:
        preprocess_calorie()
        preprocess_nutrition()
        preprocess_exercise()

        print("\n ALL DATA PREPROCESSED SUCCESSFULLY")

    except Exception as e:
        print("\n ERROR:", e)