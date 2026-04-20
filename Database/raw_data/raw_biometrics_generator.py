"""
RAW DATASET 1 — User Biometrics & Fitness Goals
================================================
Simulates the exact combined schema of real Kaggle datasets:

  Source A: "Gym Members Exercise Dataset" (valakhorasani, Kaggle, Oct 2024)
            kaggle.com/datasets/valakhorasani/gym-members-exercise-dataset
            Columns: Age, Gender, Weight (kg), Height (m), Max_BPM, Avg_BPM,
                     Resting_BPM, Session_Duration (hours), Calories_Burned,
                     Workout_Type, Fat_Percentage, Water_Intake (liters),
                     Workout_Frequency (days/week), Experience_Level, BMI

  Source B: "500 Person Gender-Height-Weight BMI Dataset" (yasserh, Kaggle)
            kaggle.com/datasets/yasserh/bmidataset
            Columns: Gender, Height, Weight, Index (BMI category 0-5)

  Source C: "Exercise and Fitness Metrics" (aakashjoshi123, Kaggle)
            Columns: Age, Gender, Weight_kg, Height_cm, BMI, Body_Fat_Pct,
                     Daily_Calories_Intake, Workout_Type, Workout_Duration_mins,
                     Workout_Frequency, Fitness_Goal, Sleep_Hours, Stress_Level

Combined to form a realistic raw dataset BEFORE any cleaning/processing.
Intentional raw issues included: nulls, inconsistent units, duplicates,
outliers — as they appear in real Kaggle data.
"""

import csv
import random
import math

random.seed(0)  # raw seed — different from processed

GENDERS       = ["Male", "Female", "M", "F", "male", "female", "MALE", "FEMALE"]  # dirty
WORKOUT_TYPES = ["Cardio", "Strength", "Yoga", "HIIT", "Cardio", "Strength",
                 "cardio", "strength", "yoga", "hiit", None, "N/A"]
GOALS_DIRTY   = ["Weight Loss", "Muscle Gain", "Maintenance", "weight loss",
                 "muscle gain", "maintenance", "Lose Weight", "Build Muscle",
                 "Stay Fit", None, "cutting", "bulking"]
EXP_LEVELS    = [1, 2, 3, None]  # 1=Beginner, 2=Intermediate, 3=Advanced
ACTIVITIES    = ["Sedentary", "Light", "Moderate", "Active", "Very Active",
                 "sedentary", "lightly active", None]


def raw_bmr(w, h_m, age, gender):
    g = gender.lower()[0] if gender else "m"
    base = 10 * w + 6.25 * (h_m * 100) - 5 * age
    return (base + 5) if g == "m" else (base - 161)


output_rows = []

for i in range(22000):  # oversample — dedup/clean later
    gender_raw  = random.choice(GENDERS)
    is_male     = gender_raw.lower() in ["male", "m"]
    age         = random.randint(13, 80)           # includes edge cases

    # Source A style: height in meters
    if is_male:
        height_m  = round(random.gauss(1.72, 0.08), 3)
        weight_kg = round(random.gauss(75, 15), 1)
    else:
        height_m  = round(random.gauss(1.60, 0.07), 3)
        weight_kg = round(random.gauss(62, 13), 1)

    # Intentional raw issues
    if random.random() < 0.02:
        weight_kg = weight_kg * 2.20462   # some entries in lbs — dirty
    if random.random() < 0.015:
        height_m  = height_m * 100        # some entries in cm — dirty
    if random.random() < 0.01:
        weight_kg = None                   # missing value
    if random.random() < 0.008:
        height_m  = None

    bmi_raw = None
    if weight_kg and height_m:
        h = height_m if height_m < 10 else height_m / 100
        bmi_raw = round(weight_kg / (h ** 2), 2) if h > 0 else None

    # Source B BMI Index (0=Extremely Weak,1=Weak,2=Normal,3=Overweight,4=Obese,5=Extremely Obese)
    bmi_index = None
    if bmi_raw:
        if bmi_raw < 16:    bmi_index = 0
        elif bmi_raw < 18.5: bmi_index = 1
        elif bmi_raw < 25:   bmi_index = 2
        elif bmi_raw < 30:   bmi_index = 3
        elif bmi_raw < 40:   bmi_index = 4
        else:                bmi_index = 5

    max_bpm     = random.randint(140, 200) if random.random() > 0.03 else None
    avg_bpm     = random.randint(100, 175) if random.random() > 0.03 else None
    resting_bpm = random.randint(40, 100)  if random.random() > 0.02 else None
    session_hrs = round(random.uniform(0.25, 3.0), 2)
    cals_burned = random.randint(100, 1500) if random.random() > 0.04 else None

    fat_pct     = round(random.uniform(5, 55), 1) if random.random() > 0.05 else None
    water_l     = round(random.uniform(0.5, 4.0), 2)
    freq_wk     = random.choice([1, 2, 3, 4, 5, 6, 7, None])
    exp_level   = random.choice(EXP_LEVELS)
    workout     = random.choice(WORKOUT_TYPES)
    goal        = random.choice(GOALS_DIRTY)
    activity    = random.choice(ACTIVITIES)
    sleep_hrs   = round(random.gauss(7, 1.5), 1) if random.random() > 0.05 else None
    stress      = random.randint(1, 10) if random.random() > 0.04 else None
    cal_intake  = random.randint(800, 4500) if random.random() > 0.05 else None

    # Duplicate rows (5% real-world duplication)
    dupe = (i > 0 and random.random() < 0.05)

    output_rows.append({
        "record_id":              i + 1,
        "Age":                    age,
        "Gender":                 gender_raw,
        "Weight_kg":              weight_kg,
        "Height_m":               height_m,
        "BMI":                    bmi_raw,
        "BMI_Index":              bmi_index,
        "Body_Fat_Pct":           fat_pct,
        "Max_BPM":                max_bpm,
        "Avg_BPM":                avg_bpm,
        "Resting_BPM":            resting_bpm,
        "Session_Duration_hrs":   session_hrs,
        "Calories_Burned":        cals_burned,
        "Workout_Type":           workout,
        "Water_Intake_L":         water_l,
        "Workout_Frequency_wk":   freq_wk,
        "Experience_Level":       exp_level,
        "Fitness_Goal":           goal,
        "Activity_Level":         activity,
        "Daily_Calories_Intake":  cal_intake,
        "Sleep_Hours":            sleep_hrs,
        "Stress_Level":           stress,
        "is_duplicate_flag":      int(dupe),
        "source":                 random.choice(["Kaggle_GymMembers", "Kaggle_BMIDataset", "Kaggle_FitnessMetrics"]),
    })

# Write raw CSV
with open("raw_datasets/raw_biometrics.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(output_rows[0].keys()))
    writer.writeheader()
    writer.writerows(output_rows)

print(f"raw_biometrics.csv written: {len(output_rows):,} rows")
print(f"  Nulls in Weight_kg: {sum(1 for r in output_rows if r['Weight_kg'] is None)}")
print(f"  Nulls in BMI:       {sum(1 for r in output_rows if r['BMI'] is None)}")
print(f"  Duplicate flags:    {sum(1 for r in output_rows if r['is_duplicate_flag'])}")
