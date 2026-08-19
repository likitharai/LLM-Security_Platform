import os
import pandas as pd

# Absolute path to the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# data/raw folder
DATA_DIR = os.path.join(BASE_DIR, "data", "raw")

files = [
    "MedQuAD.csv",
    "PubMedQA.csv",
    "mpib_sample1.csv",
    "mpib_sample2.csv",
    "mpib_validation.csv"
]

for file in files:

    path = os.path.join(DATA_DIR, file)

    print("=" * 80)
    print(f"Dataset : {file}")
    print(f"Path    : {path}")

    if not os.path.exists(path):
        print("❌ File not found")
        continue

    df = pd.read_csv(path)

    print("\nShape")
    print(df.shape)

    print("\nColumns")
    print(df.columns.tolist())

    print("\nData Types")
    print(df.dtypes)

    print("\nMissing Values")
    print(df.isnull().sum())

    print("\nDuplicate Rows")
    print(df.duplicated().sum())

    print("\nFirst 5 Rows")
    print(df.head())

    print("=" * 80)