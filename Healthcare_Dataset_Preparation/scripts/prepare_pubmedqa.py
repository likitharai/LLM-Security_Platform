import os
import pandas as pd

# -------------------------------------------------------
# Paths
# -------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "PubMedQA.csv")

OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "pubmedqa_clean.csv")

# -------------------------------------------------------
# Read Dataset
# -------------------------------------------------------

df = pd.read_csv(RAW_PATH)

print("Original Shape:", df.shape)

# -------------------------------------------------------
# Remove duplicate rows
# -------------------------------------------------------

df = df.drop_duplicates()

# -------------------------------------------------------
# Remove rows with missing Question or Long_Answer
# -------------------------------------------------------

df = df.dropna(subset=["Question", "Long_Answer"])

# -------------------------------------------------------
# Remove blank strings
# -------------------------------------------------------

df["Question"] = df["Question"].astype(str).str.strip()
df["Long_Answer"] = df["Long_Answer"].astype(str).str.strip()

df = df[df["Question"] != ""]
df = df[df["Long_Answer"] != ""]

# -------------------------------------------------------
# Remove duplicate Question + Answer
# -------------------------------------------------------

df = df.drop_duplicates(subset=["Question", "Long_Answer"])

df = df.reset_index(drop=True)

# -------------------------------------------------------
# Rename columns
# -------------------------------------------------------

df = df.rename(columns={
    "PMID": "pmid",
    "Question": "prompt",
    "Context": "context",
    "Labels": "labels",
    "Meshes": "meshes",
    "Year": "year",
    "Reasoning_Required": "reasoning_required",
    "Reasoning_Free": "reasoning_free",
    "Final_Decision": "final_decision",
    "Long_Answer": "response"
})

# -------------------------------------------------------
# Generate IDs
# -------------------------------------------------------

df.insert(0, "id", range(1, len(df) + 1))

# -------------------------------------------------------
# Add project columns
# -------------------------------------------------------

df["attack_type"] = "safe"
df["is_safe"] = 1
df["severity"] = 0
df["phi_present"] = 0
df["source_dataset"] = "PubMedQA"

# -------------------------------------------------------
# Reorder columns
# -------------------------------------------------------

df = df[
    [
        "id",
        "prompt",
        "context",
        "response",
        "pmid",
        "labels",
        "meshes",
        "year",
        "reasoning_required",
        "reasoning_free",
        "final_decision",
        "attack_type",
        "is_safe",
        "severity",
        "phi_present",
        "source_dataset"
    ]
]

# -------------------------------------------------------
# Save
# -------------------------------------------------------

df.to_csv(OUTPUT_PATH, index=False)

print("\nCleaning Completed")
print("Final Shape:", df.shape)
print("Saved to:", OUTPUT_PATH)
print(df.head())