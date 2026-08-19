import os
import pandas as pd

# =====================================================
# Paths
# =====================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROCESSED = os.path.join(BASE_DIR, "data", "processed")

# =====================================================
# Load Master Dataset
# =====================================================

train = pd.read_csv(
    os.path.join(PROCESSED, "master_train.csv")
)

validation = pd.read_csv(
    os.path.join(PROCESSED, "master_validation.csv")
)

test = pd.read_csv(
    os.path.join(PROCESSED, "master_test.csv")
)

master = pd.concat(
    [
        train,
        validation,
        test
    ],
    ignore_index=True
)

# =====================================================
# Keep only medical datasets
# =====================================================

knowledge = master[
    master["source_dataset"].isin(
        ["MedQuAD", "PubMedQA"]
    )
].copy()

# =====================================================
# Keep required columns
# =====================================================

knowledge = knowledge[
    [
        "prompt",
        "context",
        "response",
        "source_dataset"
    ]
]

# =====================================================
# Remove duplicates
# =====================================================

knowledge = knowledge.drop_duplicates(
    subset=["prompt", "response"]
)

knowledge = knowledge.reset_index(drop=True)

# =====================================================
# Save
# =====================================================

knowledge.to_csv(
    os.path.join(PROCESSED, "knowledge_base.csv"),
    index=False
)

# =====================================================
# Statistics
# =====================================================

print("=" * 60)
print("KNOWLEDGE BASE CREATED")
print("=" * 60)

print("\nShape:", knowledge.shape)

print("\nSource Distribution\n")

print(
    knowledge["source_dataset"].value_counts()
)

print("\nDuplicate Prompts:",
      knowledge["prompt"].duplicated().sum())