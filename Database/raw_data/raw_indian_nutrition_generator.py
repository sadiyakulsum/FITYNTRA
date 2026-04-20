"""
RAW DATASET 2 — Indian Nutrition & Recipe Database
===================================================
Simulates combined schema from real sources:

  Source A: ICMR-NIN Indian Food Composition Tables (IFCT 2017)
            ifct2017.github.io  |  NIN, Hyderabad
            528 raw food items, nutrients per 100g
            Energy in kJ (2017 edition), kcal (2004 edition)
            Columns: food_code, food_name, scientific_name, food_group,
                     energy_kJ, energy_kcal, protein_g, fat_g, carb_g,
                     fiber_g, calcium_mg, iron_mg, vit_c_mg, vit_a_mcg

  Source B: Indian Nutrient Databank (INDB 2024 — Vijayakumar et al.)
            PMC11277795 | CC-BY 4.0
            1095 food items + 1014 recipes
            Adds: region, recipe flag, serving_size_g, preparation_method

  Source C: Kaggle "Indian Food Nutrition" (syedkhalid076)
            kaggle.com/datasets/syedkhalid076/indian-food-nutrition
            Adds: veg/non-veg, state/region, meal_type

  Source D: Kaggle "Indian Food Dataset" (nehaprabhavalkar)
            Adds: ingredients, flavor_profile, course, diet (veg/non-veg)

Raw issues: energy in kJ vs kcal inconsistency, missing micronutrients,
duplicate food names, region inconsistencies, None values.
"""

import csv
import random
import json

random.seed(1)

# Real ICMR-NIN IFCT food groups
FOOD_GROUPS = [
    "Cereals and Millets", "Pulses and Legumes", "Vegetables", "Fruits",
    "Milk and Milk Products", "Meat, Poultry and Game", "Fish and Seafood",
    "Eggs", "Nuts and Oilseeds", "Sugars and Sugar Products",
    "Fats and Oils", "Spices and Condiments", "Beverages",
    "Composite Dishes", "Snacks and Ready-to-Eat",
]

REGIONS_DIRTY = [
    "North India", "South India", "East India", "West India",
    "Northern", "Southern", "Eastern", "Western",
    "North", "South", "East", "West",
    "Punjab", "Tamil Nadu", "Bengal", "Maharashtra",
    "Pan India", None, "Unknown",
]

DIET_TYPES = ["Vegetarian", "Non-Vegetarian", "Veg", "Non-Veg",
              "vegetarian", "non-vegetarian", "Egg", "Eggetarian", None]

MEAL_TYPES_DIRTY = ["Breakfast", "Lunch", "Dinner", "Snack",
                    "breakfast", "lunch", "dinner", "snack",
                    "Main Course", "Dessert", "Beverage", None, "Any"]

PREP_METHODS = ["Raw", "Cooked", "Boiled", "Fried", "Steamed",
                "Grilled", "Baked", "Roasted", None, "N/A"]

# Real food data seed from ICMR-NIN (100g basis)
# (name, food_group, energy_kcal, energy_kJ, protein_g, fat_g, carb_g, fiber_g,
#  calcium_mg, iron_mg, vit_c_mg, region_raw, diet_raw)
IFCT_SEED = [
    ("Rice, raw, milled",      "Cereals and Millets",     346,1448,6.8,0.5,78.2,0.2,10,0.7,0,"Pan India","Vegetarian"),
    ("Rice, cooked",           "Cereals and Millets",     130,544,2.7,0.3,28.2,0.4,3,0.2,0,"Pan India","Vegetarian"),
    ("Wheat flour, whole",     "Cereals and Millets",     341,1427,11.8,1.5,69.4,1.9,41,4.9,0,"North India","Vegetarian"),
    ("Wheat flour, refined",   "Cereals and Millets",     348,1456,10.3,0.9,73.9,0.3,23,2.7,0,"North India","Vegetarian"),
    ("Bajra (Pearl millet)",   "Cereals and Millets",     363,1519,11.6,5.0,67.5,1.2,42,8.0,0,"West India","Vegetarian"),
    ("Jowar (Sorghum)",        "Cereals and Millets",     349,1460,10.4,1.9,72.6,1.6,25,4.1,0,"West India","Vegetarian"),
    ("Ragi (Finger millet)",   "Cereals and Millets",     328,1373,7.3,1.5,66.8,3.6,344,3.9,0,"South India","Vegetarian"),
    ("Maize flour",            "Cereals and Millets",     355,1485,8.7,3.6,70.0,2.7,9,2.3,0,"Pan India","Vegetarian"),
    ("Oats",                   "Cereals and Millets",     389,1628,16.9,6.9,66.3,10.6,54,4.7,0,"North India","Vegetarian"),
    ("Semolina (Rava)",        "Cereals and Millets",     360,1506,10.0,1.0,74.0,2.0,16,4.7,0,"Pan India","Vegetarian"),
    ("Toor dal, raw",          "Pulses and Legumes",      335,1402,22.3,1.7,57.6,4.2,73,5.6,0,"Pan India","Vegetarian"),
    ("Moong dal, raw",         "Pulses and Legumes",      334,1398,24.0,1.3,59.9,4.1,75,6.7,7,"Pan India","Vegetarian"),
    ("Chana dal, raw",         "Pulses and Legumes",      372,1556,20.8,5.6,59.8,7.2,56,4.9,1,"North India","Vegetarian"),
    ("Rajma (Kidney beans)",   "Pulses and Legumes",      346,1448,22.9,1.5,60.6,6.4,260,7.0,4,"North India","Vegetarian"),
    ("Kabuli chana",           "Pulses and Legumes",      360,1507,20.1,5.3,60.9,7.6,202,4.9,3,"North India","Vegetarian"),
    ("Urad dal, raw",          "Pulses and Legumes",      341,1428,25.1,1.4,59.0,1.8,154,4.5,0,"South India","Vegetarian"),
    ("Masoor dal, raw",        "Pulses and Legumes",      343,1435,25.1,0.9,59.0,3.5,68,7.6,1,"East India","Vegetarian"),
    ("Soybean, raw",           "Pulses and Legumes",      432,1808,36.5,19.9,30.2,9.3,240,15.7,17,"West India","Vegetarian"),
    ("Cowpea (Black-eyed pea)","Pulses and Legumes",      323,1351,23.4,1.8,54.5,5.1,227,8.6,1,"South India","Vegetarian"),
    ("Peanut, raw",            "Nuts and Oilseeds",       567,2373,25.8,49.2,16.1,8.5,92,4.6,0,"West India","Vegetarian"),
    ("Potato, raw",            "Vegetables",               77,322,1.9,0.1,17.8,1.8,11,0.7,13,"Pan India","Vegetarian"),
    ("Tomato, raw",            "Vegetables",               18,75,0.9,0.2,3.9,1.2,13,0.4,27,"Pan India","Vegetarian"),
    ("Onion, raw",             "Vegetables",               40,167,1.1,0.1,9.3,1.7,23,0.4,7,"Pan India","Vegetarian"),
    ("Spinach (Palak), raw",   "Vegetables",               23,96,2.0,0.3,3.5,2.2,99,1.8,28,"Pan India","Vegetarian"),
    ("Cauliflower, raw",       "Vegetables",               25,105,1.9,0.4,4.9,2.5,22,0.4,48,"North India","Vegetarian"),
    ("Brinjal (Eggplant)",     "Vegetables",               25,105,1.4,0.3,5.5,3.4,18,0.3,2,"Pan India","Vegetarian"),
    ("Okra (Bhindi)",          "Vegetables",               33,138,2.1,0.2,7.0,2.5,82,0.8,21,"Pan India","Vegetarian"),
    ("Bitter gourd (Karela)",  "Vegetables",               17,71,1.0,0.2,3.4,2.8,20,0.6,84,"Pan India","Vegetarian"),
    ("Fenugreek leaves (Methi)","Vegetables",              49,205,4.4,0.9,6.0,1.1,395,1.9,52,"North India","Vegetarian"),
    ("Bottle gourd (Lauki)",   "Vegetables",               14,59,0.6,0.1,3.4,0.5,26,0.5,10,"Pan India","Vegetarian"),
    ("Coconut, fresh",         "Nuts and Oilseeds",       354,1482,3.3,33.5,15.2,9.0,14,1.9,3,"South India","Vegetarian"),
    ("Mango, ripe (Alphonso)", "Fruits",                   70,293,0.6,0.4,17.0,1.6,10,0.3,36,"West India","Vegetarian"),
    ("Banana (Cavendish)",     "Fruits",                   89,372,1.1,0.3,23.0,2.6,5,0.3,8,"South India","Vegetarian"),
    ("Papaya, ripe",           "Fruits",                   43,180,0.5,0.1,10.8,1.7,20,0.1,62,"South India","Vegetarian"),
    ("Guava",                  "Fruits",                   68,285,2.6,1.0,14.3,5.4,18,0.3,228,"South India","Vegetarian"),
    ("Amla (Indian gooseberry)","Fruits",                  44,184,0.9,0.6,10.2,4.3,50,1.2,600,"Pan India","Vegetarian"),
    ("Watermelon",             "Fruits",                   30,125,0.6,0.2,7.6,0.4,7,0.4,8,"Pan India","Vegetarian"),
    ("Pomegranate",            "Fruits",                   83,347,1.7,1.2,18.7,4.0,10,0.3,10,"West India","Vegetarian"),
    ("Milk, whole (cow)",      "Milk and Milk Products",   61,255,3.2,3.2,4.8,0,"Pan India","Vegetarian"),
    ("Curd (Dahi), whole",     "Milk and Milk Products",   98,410,3.3,4.3,4.7,0,"Pan India","Vegetarian"),
    ("Paneer (cottage cheese)","Milk and Milk Products",  265,1109,18.3,20.8,1.2,0,"North India","Vegetarian"),
    ("Ghee (clarified butter)","Fats and Oils",            900,3766,0,99.5,0,0,"Pan India","Vegetarian"),
    ("Mustard oil",            "Fats and Oils",            884,3699,0,100,0,0,"East India","Vegetarian"),
    ("Coconut oil",            "Fats and Oils",            892,3732,0,99.1,0,0,"South India","Vegetarian"),
    ("Chicken, raw (broiler)", "Meat, Poultry and Game",  215,900,18.6,15.1,0,0,"Pan India","Non-Vegetarian"),
    ("Mutton, raw (lean)",     "Meat, Poultry and Game",  118,494,21.4,3.3,0,0,"Pan India","Non-Vegetarian"),
    ("Rohu fish, raw",         "Fish and Seafood",         97,406,17.7,1.4,0,0,"East India","Non-Vegetarian"),
    ("Pomfret, raw",           "Fish and Seafood",         96,402,17.2,2.1,0,0,"West India","Non-Vegetarian"),
    ("Prawn (shrimp), raw",    "Fish and Seafood",        106,443,20.3,1.7,0.9,0,"South India","Non-Vegetarian"),
    ("Hilsa (Ilish), raw",     "Fish and Seafood",        273,1143,21.8,20.8,0,0,"East India","Non-Vegetarian"),
    ("Egg, hen, whole, raw",   "Eggs",                    155,648,13.0,11.0,1.1,0,"Pan India","Egg"),
    ("Egg white, raw",         "Eggs",                     52,218,11.0,0.2,0.7,0,"Pan India","Egg"),
    ("Egg yolk, raw",          "Eggs",                    322,1348,15.9,27.0,3.6,0,"Pan India","Egg"),
    ("Sugar, white",           "Sugars and Sugar Products",387,1620,0,0,99.9,0,"Pan India","Vegetarian"),
    ("Jaggery (Gur)",          "Sugars and Sugar Products",383,1602,0.4,0.1,98.0,0,"Pan India","Vegetarian"),
    ("Honey",                  "Sugars and Sugar Products",304,1272,0.3,0,82.4,0.2,"Pan India","Vegetarian"),
    ("Turmeric powder",        "Spices and Condiments",   354,1482,8.0,9.9,64.9,21.1,"Pan India","Vegetarian"),
    ("Cumin seeds (Jeera)",    "Spices and Condiments",   375,1569,17.8,22.3,44.2,10.5,"Pan India","Vegetarian"),
    ("Coriander seeds (Dhaniya)","Spices and Condiments", 298,1247,12.4,17.8,54.2,0,"Pan India","Vegetarian"),
    ("Red chilli powder",      "Spices and Condiments",   282,1180,13.5,12.0,49.9,30.2,"Pan India","Vegetarian"),
    ("Garam masala",           "Spices and Condiments",   379,1586,12.0,15.0,65.0,25.0,"Pan India","Vegetarian"),
    ("Tamarind",               "Spices and Condiments",   239,1000,2.8,0.6,62.5,5.1,"South India","Vegetarian"),
    ("Almonds",                "Nuts and Oilseeds",       579,2423,21.2,49.9,21.5,12.5,"North India","Vegetarian"),
    ("Cashew nuts, raw",       "Nuts and Oilseeds",       553,2314,18.2,43.9,30.2,3.3,"West India","Vegetarian"),
    ("Flaxseeds (Alsi)",       "Nuts and Oilseeds",       534,2234,18.3,42.2,28.9,27.3,"North India","Vegetarian"),
    ("Sesame seeds (Til)",     "Nuts and Oilseeds",       573,2397,17.7,49.7,23.5,11.8,"West India","Vegetarian"),
    ("Idli (steamed)",         "Composite Dishes",         39,163,2.0,0.1,7.9,0,"South India","Vegetarian"),
    ("Dosa, plain",            "Composite Dishes",        133,556,3.5,3.2,23.0,0.5,"South India","Vegetarian"),
    ("Chapati/Roti (wheat)",   "Composite Dishes",        104,435,3.1,2.5,18.0,1.9,"North India","Vegetarian"),
    ("Sambar",                 "Composite Dishes",         55,230,3.0,1.2,8.0,1.8,"South India","Vegetarian"),
    ("Dal makhani",            "Composite Dishes",        175,732,8.5,7.5,20.0,3.5,"North India","Vegetarian"),
    ("Chicken curry",          "Composite Dishes",        190,795,18.0,12.0,4.0,0.5,"North India","Non-Vegetarian"),
    ("Biryani, chicken",       "Composite Dishes",        220,921,12.0,8.0,27.0,0.8,"Pan India","Non-Vegetarian"),
    ("Upma",                   "Composite Dishes",        135,565,3.5,4.2,22.0,1.1,"South India","Vegetarian"),
    ("Poha (cooked)",          "Composite Dishes",        130,544,3.0,1.9,26.0,0.5,"West India","Vegetarian"),
    ("Pav bhaji",              "Composite Dishes",        170,711,4.5,5.5,28.0,3.0,"West India","Vegetarian"),
    ("Chole (cooked)",         "Composite Dishes",        164,686,8.9,2.6,27.4,7.6,"North India","Vegetarian"),
    ("Gulab jamun",            "Sugars and Sugar Products",380,1590,5.5,15.0,56.0,0.5,"North India","Vegetarian"),
    ("Kheer (rice pudding)",   "Sugars and Sugar Products",150,628,4.0,5.0,24.0,0.2,"North India","Vegetarian"),
    ("Masala chai (with milk)","Beverages",                46,192,2.0,2.0,5.5,0,"North India","Vegetarian"),
    ("Coconut water",          "Beverages",                19,79,0.7,0.2,3.7,1.1,"South India","Vegetarian"),
    ("Lassi (salted)",         "Beverages",                63,264,3.0,3.0,5.0,0,"North India","Vegetarian"),
    ("Filter coffee (milk)",   "Beverages",                40,167,1.8,1.8,4.8,0,"South India","Vegetarian"),
]

rows = []

for i, entry in enumerate(IFCT_SEED):
    if len(entry) == 13:
        name, fg, kcal, kj, pro, fat, carb, fiber, ca, fe, vc, region, diet = entry
    elif len(entry) == 11:
        name, fg, kcal, kj, pro, fat, carb, ca, region, diet = entry
        fiber, fe, vc = None, None, None

    # Simulate raw issues
    # Some IFCT 2017 entries only have kJ (need conversion)
    energy_kcal_raw = kcal if random.random() > 0.15 else None   # missing in some entries
    energy_kj_raw   = kj   if random.random() > 0.10 else None

    # Region dirty representation
    region_raw = region
    if random.random() < 0.2:
        region_raw = random.choice(REGIONS_DIRTY)

    diet_raw = diet
    if random.random() < 0.15:
        diet_raw = random.choice(DIET_TYPES)

    rows.append({
        "food_code":        f"IFCT{i+1:04d}",
        "food_name":        name,
        "food_group":       fg,
        "scientific_name":  None if random.random() < 0.6 else f"Scientific_{i}",
        "energy_kcal":      energy_kcal_raw,
        "energy_kJ":        energy_kj_raw,
        "protein_g":        pro,
        "fat_g":            fat,
        "carbohydrate_g":   carb,
        "fiber_g":          fiber if random.random() > 0.1 else None,
        "calcium_mg":       ca if random.random() > 0.08 else None,
        "iron_mg":          fe if random.random() > 0.12 else None,
        "vitamin_c_mg":     vc if random.random() > 0.15 else None,
        "region":           region_raw,
        "diet_type":        diet_raw,
        "meal_type":        random.choice(MEAL_TYPES_DIRTY),
        "preparation_method": random.choice(PREP_METHODS),
        "serving_size_g":   random.choice([100, 150, 200, None, "N/A"]),
        "is_recipe":        1 if fg == "Composite Dishes" else 0,
        "source":           random.choice(["ICMR_IFCT2017", "INDB_2024", "Kaggle_IndianFood", "Kaggle_IndianNutrition"]),
        "data_quality_flag":random.choice(["OK", "Missing_Energy", "Region_Unverified", "OK", "OK"]),
    })

# Add synthetic extensions to reach 6000+ for cleaning pipeline demo
extra_foods = [
    ("Rasam", "Composite Dishes", 30, 125, 1.2, 0.8, 4.5, None, None, None, None, "South India", "Vegetarian"),
    ("Avial", "Composite Dishes", 115, 481, 2.8, 6.5, 12.0, 3.0, None, None, None, "South India", "Vegetarian"),
    ("Puttu", "Composite Dishes", 175, 733, 3.5, 1.2, 38.0, 1.5, None, None, None, "South India", "Vegetarian"),
    ("Appam", "Composite Dishes", 120, 502, 2.5, 2.8, 22.0, 0.5, None, None, None, "South India", "Vegetarian"),
    ("Dhokla", "Composite Dishes", 76, 318, 3.5, 1.5, 12.0, 0.8, None, None, None, "West India", "Vegetarian"),
    ("Khandvi", "Composite Dishes", 130, 544, 4.5, 4.8, 18.0, 1.2, None, None, None, "West India", "Vegetarian"),
    ("Methi thepla", "Composite Dishes", 285, 1193, 7.5, 12.0, 38.0, 3.0, None, None, None, "West India", "Vegetarian"),
    ("Shrikhand", "Milk and Milk Products", 220, 921, 7.0, 7.0, 33.0, None, None, None, None, "West India", "Vegetarian"),
    ("Machher jhol", "Composite Dishes", 155, 649, 17.0, 9.0, 3.0, 0.6, None, None, None, "East India", "Non-Vegetarian"),
    ("Litti chokha", "Composite Dishes", 320, 1340, 9.0, 10.0, 50.0, 3.5, None, None, None, "East India", "Vegetarian"),
    ("Sattu (roasted gram flour)", "Cereals and Millets", 406, 1700, 22.5, 7.0, 64.0, 1.8, None, None, None, "East India", "Vegetarian"),
    ("Momos, veg (steamed)", "Composite Dishes", 180, 753, 5.5, 5.5, 28.0, 2.0, None, None, None, "East India", "Vegetarian"),
    ("Bamboo shoots", "Vegetables", 27, 113, 2.6, 0.3, 5.2, 2.2, None, None, None, "East India", "Vegetarian"),
    ("Jackfruit, raw", "Fruits", 95, 398, 1.7, 0.6, 23.2, 1.5, None, None, None, "South India", "Vegetarian"),
    ("Soya chunks, raw", "Pulses and Legumes", 345, 1444, 52.0, 0.5, 33.0, 13.0, None, None, None, "Pan India", "Vegetarian"),
    ("Tofu, firm", "Pulses and Legumes", 76, 318, 8.0, 4.8, 1.9, 0.3, None, None, None, "West India", "Vegetarian"),
    ("Sabudana (Tapioca pearls)", "Cereals and Millets", 351, 1469, 0.2, 0.2, 88.7, 0.9, None, None, None, "West India", "Vegetarian"),
    ("Puri (fried)", "Composite Dishes", 340, 1423, 6.5, 19.0, 38.0, 1.5, None, None, None, "North India", "Vegetarian"),
    ("Paratha, plain", "Composite Dishes", 300, 1256, 6.0, 13.0, 40.0, 2.0, None, None, None, "North India", "Vegetarian"),
    ("Egg curry", "Composite Dishes", 165, 691, 11.0, 12.0, 4.0, 0.8, None, None, None, "North India", "Egg"),
]

for j, entry in enumerate(extra_foods):
    name, fg, kcal, kj, pro, fat, carb, fiber, ca, fe, vc, region, diet = entry
    rows.append({
        "food_code":        f"INDB{j+1:04d}",
        "food_name":        name,
        "food_group":       fg,
        "scientific_name":  None,
        "energy_kcal":      kcal,
        "energy_kJ":        kj,
        "protein_g":        pro,
        "fat_g":            fat,
        "carbohydrate_g":   carb,
        "fiber_g":          fiber,
        "calcium_mg":       ca,
        "iron_mg":          fe,
        "vitamin_c_mg":     vc,
        "region":           region,
        "diet_type":        diet,
        "meal_type":        random.choice(MEAL_TYPES_DIRTY),
        "preparation_method": random.choice(PREP_METHODS),
        "serving_size_g":   100,
        "is_recipe":        1 if fg == "Composite Dishes" else 0,
        "source":           "INDB_2024",
        "data_quality_flag":"OK",
    })

# Extend to 6000 with variations
base_idx = len(rows)
while len(rows) < 6000:
    base = random.choice(rows[:100])
    new_row = dict(base)
    new_row["food_code"] = f"SYN{len(rows):05d}"
    new_row["food_name"] = base["food_name"] + random.choice([" (boiled)", " (fried)", " (steamed)", " (raw)", " (roasted)"])
    if new_row["energy_kcal"]:
        noise = random.uniform(-0.08, 0.08)
        new_row["energy_kcal"] = round(new_row["energy_kcal"] * (1 + noise), 1)
    new_row["data_quality_flag"] = "Synthetic_Variant"
    new_row["source"] = "Synthetic_IFCT_schema"
    rows.append(new_row)

# Write raw CSV
fields = list(rows[0].keys())
with open("raw_datasets/raw_indian_nutrition.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)

print(f"raw_indian_nutrition.csv: {len(rows):,} rows")
missing_kcal = sum(1 for r in rows if r["energy_kcal"] is None)
missing_reg  = sum(1 for r in rows if r["region"] in [None, "Unknown"])
print(f"  Missing energy_kcal: {missing_kcal}")
print(f"  Missing/unknown region: {missing_reg}")
