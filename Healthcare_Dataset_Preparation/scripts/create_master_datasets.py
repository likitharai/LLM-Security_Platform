import os
import pandas as pd
from sklearn.model_selection import train_test_split

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PROCESSED = os.path.join(BASE_DIR, "data", "processed")
SYNTHETIC = os.path.join(BASE_DIR, "data", "synthetic")

RANDOM_STATE = 42


# ==========================================================
# Load datasets
# ==========================================================

medquad = pd.read_csv(
    os.path.join(PROCESSED, "medquad_clean.csv")
)

pubmed = pd.read_csv(
    os.path.join(PROCESSED, "pubmedqa_clean.csv")
)

mpib_train = pd.read_csv(
    os.path.join(PROCESSED, "mpib_train_clean.csv")
)

mpib_validation = pd.read_csv(
    os.path.join(PROCESSED, "mpib_validation_clean.csv")
)

mpib_test = pd.read_csv(
    os.path.join(PROCESSED, "mpib_test_clean.csv")
)

general = pd.read_csv(
    os.path.join(SYNTHETIC,
                 "general_healthcare_prompts.csv")
)

phi = pd.read_csv(
    os.path.join(SYNTHETIC,
                 "phi_prompts.csv")
)

jailbreak = pd.read_csv(
    os.path.join(SYNTHETIC,
                 "jailbreak_prompts.csv")
)

# ==========================================================
# Split MedQuAD
# ==========================================================

med_train, med_temp = train_test_split(
    medquad,
    test_size=0.20,
    random_state=RANDOM_STATE,
    shuffle=True
)

med_validation, med_test = train_test_split(
    med_temp,
    test_size=0.50,
    random_state=RANDOM_STATE
)

# ==========================================================
# Split PubMedQA
# ==========================================================

pub_train, pub_temp = train_test_split(
    pubmed,
    test_size=0.20,
    random_state=RANDOM_STATE,
    shuffle=True
)

pub_validation, pub_test = train_test_split(
    pub_temp,
    test_size=0.50,
    random_state=RANDOM_STATE
)

# ==========================================================
# Split Synthetic
# ==========================================================

synthetic = pd.concat(
    [
        general,
        phi,
        jailbreak
    ],
    ignore_index=True
)

syn_train, syn_temp = train_test_split(
    synthetic,
    test_size=0.20,
    random_state=RANDOM_STATE,
    shuffle=True
)

syn_validation, syn_test = train_test_split(
    syn_temp,
    test_size=0.50,
    random_state=RANDOM_STATE
)

# ==========================================================
# Find all columns automatically
# ==========================================================

all_columns = set()

for df in [
    med_train,
    pub_train,
    mpib_train,
    syn_train
]:
    all_columns.update(df.columns)

all_columns = sorted(list(all_columns))


# ==========================================================
# Standardize
# ==========================================================

def standardize(df):

    for col in all_columns:

        if col not in df.columns:

            if col in [
                "context",
                "response"
            ]:
                df[col] = ""

            elif col in [
                "severity"
            ]:
                df[col] = 0

            elif col in [
                "is_safe"
            ]:
                df[col] = 1

            elif col in [
                "phi_present"
            ]:
                df[col] = 0

            else:
                df[col] = ""

    return df[all_columns]


# ==========================================================
# Standardize datasets
# ==========================================================

med_train = standardize(med_train)
med_validation = standardize(med_validation)
med_test = standardize(med_test)

pub_train = standardize(pub_train)
pub_validation = standardize(pub_validation)
pub_test = standardize(pub_test)

mpib_train = standardize(mpib_train)
mpib_validation = standardize(mpib_validation)
mpib_test = standardize(mpib_test)

syn_train = standardize(syn_train)
syn_validation = standardize(syn_validation)
syn_test = standardize(syn_test)

# ==========================================================
# Build Master datasets
# ==========================================================

master_train = pd.concat(
    [
        med_train,
        pub_train,
        mpib_train,
        syn_train
    ],
    ignore_index=True
)

master_validation = pd.concat(
    [
        med_validation,
        pub_validation,
        mpib_validation,
        syn_validation
    ],
    ignore_index=True
)

master_test = pd.concat(
    [
        med_test,
        pub_test,
        mpib_test,
        syn_test
    ],
    ignore_index=True
)

# Shuffle

master_train = master_train.sample(
    frac=1,
    random_state=RANDOM_STATE
).reset_index(drop=True)

master_validation = master_validation.sample(
    frac=1,
    random_state=RANDOM_STATE
).reset_index(drop=True)

master_test = master_test.sample(
    frac=1,
    random_state=RANDOM_STATE
).reset_index(drop=True)

# ==========================================================
# Save
# ==========================================================

master_train.to_csv(
    os.path.join(PROCESSED, "master_train.csv"),
    index=False
)

master_validation.to_csv(
    os.path.join(PROCESSED, "master_validation.csv"),
    index=False
)

master_test.to_csv(
    os.path.join(PROCESSED, "master_test.csv"),
    index=False
)

# ==========================================================
# Statistics
# ==========================================================

print("=" * 60)
print("MASTER DATASETS CREATED")
print("=" * 60)

print("\nTrain :", master_train.shape)
print("Validation :", master_validation.shape)
print("Test :", master_test.shape)

print("\nColumns :", len(master_train.columns))

print("\nClass Distribution\n")

print(master_train["attack_type"].value_counts())

print("\nSource Distribution\n")

print(
    master_train.groupby(
        ["source_dataset",
         "attack_type"]
    ).size()
)

print("\nTotal Columns")

print(master_train.columns.tolist())