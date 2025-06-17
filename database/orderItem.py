import pandas as pd

# 1. CSV-Datei laden
df = pd.read_csv("C:/Users/Adam/Documents/Semester 4/products.csv")

# 2. Zutatenliste extrahieren: (SKU, Zutat)
rows = []
for _, row in df.iterrows():
    sku = row['SKU']
    ingredients = row['Ingredients']
    if pd.notna(ingredients):
        ingredient_list = [i.strip() for i in ingredients.split(',')]
        for ingredient in ingredient_list:
            rows.append((sku, ingredient))

# 3. DataFrame bauen
pizza_ingredients_df = pd.DataFrame(rows, columns=["SKU", "ingredientName"])

# 4. IngredientID-Zuordnung vorbereiten (aus vorhandener ingredients-Tabelle)
# Hier manuell eintragen, was du schon in MySQL hast – z. B.:
ingredient_id_map = {
    'BBQ Sauce': 1,
    'Bacon': 2,
    'Basil': 3,
    'Bell Peppers': 4,
    'Blue Cheese': 5,
    'Buffalo Sauce': 6,
    'Canadian Bacon': 7,
    'Cheddar Cheese': 8,
    'Chicken': 9,
    'Cilantro': 10,
    'Feta Cheese': 11,
    'Fresh Mozzarella': 12,
    'Garlic': 13,
    'Green Olives': 14,
    'Ground Beef': 15,
    'Ham': 16,
    'Italian Sausage': 17,
    'Jalapeños': 18,
    'Mushrooms': 19,
    'Onions': 20,
    'Parmesan': 21,
    'Pepperoni': 22,
    'Pesto Sauce': 23,
    'Pineapple': 24,
    'Red Onions': 25,
    'Red Peppers': 26,
    'Ricotta Cheese': 27,
    'Sausage': 28,
    'Spinach': 29,
    'Sun-Dried Tomatoes': 30,
    'Tomatoes': 31,
    'Tomato Sauce': 32,
    'Turkey': 33
    # ... ergänze die restlichen Zutaten mit den IDs aus deiner Datenbank
}

# 5. ingredientID einfügen
pizza_ingredients_df["ingredientID"] = pizza_ingredients_df["ingredientName"].map(ingredient_id_map)

# 6. Nur gültige Zuordnungen nehmen
final_df = pizza_ingredients_df.dropna(subset=["ingredientID"]).drop_duplicates()

# 7. INSERT-Befehle erzeugen
for _, row in final_df.iterrows():
    print(f"INSERT INTO pizza_ingredients (SKU, ingredientID) VALUES ('{row.SKU}', {int(row.ingredientID)});")
