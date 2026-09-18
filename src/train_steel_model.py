"""
6.1 Kaggle — Steel Industry Energy Consumption (offline, for model training only)
bash
pip install kaggle
# place kaggle.json (Kaggle → Account → Create New API Token) at ~/.kaggle/kaggle.json
kaggle datasets download -d csafrit2/steel-industry-energy-consumption -p data/ --unzip
"""
import os
import sys

def train_steel_model():
    data_path = os.path.join("data", "Steel_industry_data.csv")
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}.")
        print("To download: kaggle datasets download -d csafrit2/steel-industry-energy-consumption -p data/ --unzip")
        return

    try:
        import pandas as pd
        from sklearn.ensemble import GradientBoostingRegressor
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import r2_score, mean_absolute_error
        import joblib
    except ImportError:
        print("Required libraries missing. Run: pip install pandas scikit-learn joblib")
        return

    print("Loading Steel_industry_data.csv...")
    df = pd.read_csv(data_path)

    features = [
        "Usage_kWh", 
        "Lagging_Current_Reactive.Power_kVarh", 
        "Leading_Current_Reactive_Power_kVarh",
        "Lagging_Current_Power_Factor", 
        "Leading_Current_Power_Factor",
        "NSM"
    ]
    
    # One-hot encode categorical features
    X = pd.get_dummies(df[features + ["Load_Type", "WeekStatus"]], drop_first=True)
    y = df["CO2(tCO2)"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training GradientBoostingRegressor on steel operations telemetry...")
    model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42)
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)

    print(f"Model Training Finished: R2 = {r2:.4f}, MAE = {mae:.5f} tCO2")
    os.makedirs("src", exist_ok=True)
    joblib.dump(model, os.path.join("src", "model.pkl"))
    print("Saved trained model to src/model.pkl")

if __name__ == "__main__":
    train_steel_model()
