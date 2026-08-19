import os
import pandas as pd

# =====================================================
# Paths
# =====================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROCESSED = os.path.join(BASE_DIR, "data", "processed")

# =====================================================
# Configuration
# =====================================================

MEDQUAD_SAMPLE = 1000
PUBMEDQA_SAMPLE = 300
RANDOM_STATE = 42

# =====================================================
# Load Master Datasets
# =====================================================

train = pd.read_csv(os.path.join(PROCESSED, "master_train.csv"))
validation = pd.read_csv(os.path.join(PROCESSED, "master_validation.csv"))
test = pd.read_csv(os.path.join(PROCESSED, "master_test.csv"))

# =====================================================
# Build Security Dataset
# =====================================================

def build_security_dataset(df):

    # Keep all non-medical datasets
    security = df[
        ~df["source_dataset"].isin(["MedQuAD", "PubMedQA"])
    ].copy()

    # Sample MedQuAD safe prompts
    medquad = df[df["source_dataset"] == "MedQuAD"]

    if len(medquad) > MEDQUAD_SAMPLE:
        medquad = medquad.sample(
            n=MEDQUAD_SAMPLE,
            random_state=RANDOM_STATE
        )

    # Sample PubMedQA safe prompts
    pubmed = df[df["source_dataset"] == "PubMedQA"]

    if len(pubmed) > PUBMEDQA_SAMPLE:
        pubmed = pubmed.sample(
            n=PUBMEDQA_SAMPLE,
            random_state=RANDOM_STATE
        )

    security = pd.concat(
        [security, medquad, pubmed],
        ignore_index=True
    )

    security = security.sample(
        frac=1,
        random_state=RANDOM_STATE
    ).reset_index(drop=True)

    return security[
        [
            "prompt",
            "attack_type",
            "severity",
            "is_safe",
            "phi_present",
            "source_dataset"
        ]
    ]

# =====================================================
# Create datasets
# =====================================================

security_train = build_security_dataset(train)
security_validation = build_security_dataset(validation)
security_test = build_security_dataset(test)

# =====================================================
# Save
# =====================================================

security_train.to_csv(
    os.path.join(PROCESSED, "security_train.csv"),
    index=False
)

security_validation.to_csv(
    os.path.join(PROCESSED, "security_validation.csv"),
    index=False
)

security_test.to_csv(
    os.path.join(PROCESSED, "security_test.csv"),
    index=False
)

# =====================================================
# Statistics
# =====================================================

print("=" * 60)
print("SECURITY DATASETS CREATED")
print("=" * 60)

print("\nTrain:", security_train.shape)
print("Validation:", security_validation.shape)
print("Test:", security_test.shape)

print("\nTraining Distribution\n")
print(security_train["attack_type"].value_counts())

print("\nTraining Source Distribution\n")
print(
    security_train.groupby(
        ["source_dataset", "attack_type"]
    ).size()
)