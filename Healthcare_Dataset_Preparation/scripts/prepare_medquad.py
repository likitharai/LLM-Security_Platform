import os
import pandas as pd

# -------------------------------------------------------
# Paths
# -------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "MedQuAD.csv")

OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "medquad_clean.csv")

# -------------------------------------------------------
# Read Dataset
# -------------------------------------------------------

df = pd.read_csv(RAW_PATH)

print("Original Shape:", df.shape)

# -------------------------------------------------------
# Cleaning
# -------------------------------------------------------

df = df.drop_duplicates()

df = df.dropna(subset=["Question", "Answer"])

df["Question"] = df["Question"].astype(str).str.strip()
df["Answer"] = df["Answer"].astype(str).str.strip()

df = df[df["Question"] != ""]
df = df[df["Answer"] != ""]

df = df.drop_duplicates(subset=["Question"])

df = df.reset_index(drop=True)

# -------------------------------------------------------
# Rename Columns
# -------------------------------------------------------

df = df.rename(columns={
    "Question": "prompt",
    "Answer": "response",
    "Disease": "disease",
    "Question_Type": "question_type",
    "Source": "source_name",
    "URL": "url"
})

# -------------------------------------------------------
# New Columns
# -------------------------------------------------------

df.insert(0, "id", range(1, len(df)+1))

df["context"] = ""

df["attack_type"] = "safe"

df["is_safe"] = 1

df["severity"] = 0

df["phi_present"] = 0

df["source_dataset"] = "MedQuAD"

# -------------------------------------------------------
# Final Columns
# -------------------------------------------------------

df = df[
    [
        "id",
        "prompt",
        "context",
        "response",
        "attack_type",
        "is_safe",
        "severity",
        "phi_present",
        "disease",
        "question_type",
        "source_name",
        "url",
        "source_dataset"
    ]
]

# -------------------------------------------------------
# Save
# -------------------------------------------------------

df.to_csv(OUTPUT_PATH, index=False)

print("\nCleaning Completed")
print("Final Shape:", df.shape)

print("\nSaved to:")
print(OUTPUT_PATH)

print("\nFirst Five Rows")
print(df.head())