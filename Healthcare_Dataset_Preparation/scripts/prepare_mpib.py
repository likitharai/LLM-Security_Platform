import os
import ast
import pandas as pd


# ==========================================================
# Paths
# ==========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
OUTPUT_DIR = os.path.join(BASE_DIR, "data", "processed")

os.makedirs(OUTPUT_DIR, exist_ok=True)


# ==========================================================
# Function
# ==========================================================

def preprocess_mpib(input_filename, output_filename):

    input_path = os.path.join(RAW_DIR, input_filename)
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    print("=" * 80)
    print(f"Processing : {input_filename}")

    df = pd.read_csv(input_path)

    print("Original Shape :", df.shape)

    # ------------------------------------------------------
    # Remove duplicate rows
    # ------------------------------------------------------

    df = df.drop_duplicates()

    # ------------------------------------------------------
    # Remove rows with missing prompts
    # ------------------------------------------------------

    df = df.dropna(subset=["user_query"])

    df["user_query"] = (
        df["user_query"]
        .astype(str)
        .str.strip()
    )

    df = df[df["user_query"] != ""]

    # ------------------------------------------------------
    # Parse labels column
    # ------------------------------------------------------

    harm_types = []
    severity = []
    expected_safe_behavior = []

    for label in df["labels"]:

        try:

            parsed = ast.literal_eval(label)

            harm_types.append(
                ",".join(parsed.get("harm_types", []))
            )

            severity.append(
                parsed.get("severity", 0)
            )

            expected_safe_behavior.append(
                parsed.get("expected_safe_behavior", "")
            )

        except Exception:

            harm_types.append("")
            severity.append(0)
            expected_safe_behavior.append("")

    df["harm_types"] = harm_types
    df["severity"] = severity
    df["expected_safe_behavior"] = expected_safe_behavior

    # ------------------------------------------------------
    # Create attack class
    # ------------------------------------------------------

    def attack_label(x):

        if x == 0:
            return "safe"

        elif x <= 2:
            return "suspicious"

        else:
            return "malicious"

    df["attack_type"] = df["severity"].apply(attack_label)

    # ------------------------------------------------------
    # Safe flag
    # ------------------------------------------------------

    df["is_safe"] = (
        df["severity"] == 0
    ).astype(int)

    # ------------------------------------------------------
    # PHI flag
    # ------------------------------------------------------

    df["phi_present"] = (
        df["harm_types"]
        .str.contains("H3", na=False)
        .astype(int)
    )

    # ------------------------------------------------------
    # Rename columns
    # ------------------------------------------------------

    df = df.rename(columns={

        "user_query": "prompt",

        "contexts": "context",

        "rule": "rule_name"

    })

    # ------------------------------------------------------
    # Add source
    # ------------------------------------------------------

    df["source_dataset"] = "MPIB"

    # ------------------------------------------------------
    # Create IDs
    # ------------------------------------------------------

    df = df.reset_index(drop=True)

    df.insert(
        0,
        "id",
        range(1, len(df) + 1)
    )

    # ------------------------------------------------------
    # Keep only required columns
    # ------------------------------------------------------

    columns = [

        "id",

        "prompt",

        "context",

        "expected_safe_behavior",

        "attack_type",

        "harm_types",

        "severity",

        "is_safe",

        "phi_present",

        "scenario",

        "rule_name",

        "metadata",

        "parent_sample_id",

        "sample_id",

        "source_dataset"

    ]

    df = df[columns]

    # ------------------------------------------------------
    # Save
    # ------------------------------------------------------

    df.to_csv(
        output_path,
        index=False
    )

    # ------------------------------------------------------
    # Statistics
    # ------------------------------------------------------

    print("Final Shape :", df.shape)

    print("\nAttack Distribution")

    print(df["attack_type"].value_counts())

    print("\nSeverity Distribution")

    print(df["severity"].value_counts().sort_index())

    print("\nSaved ->")

    print(output_path)

    print("=" * 80)


# ==========================================================
# Process all datasets
# ==========================================================

preprocess_mpib(
    "mpib_sample1.csv",
    "mpib_train_clean.csv"
)

preprocess_mpib(
    "mpib_validation.csv",
    "mpib_validation_clean.csv"
)

preprocess_mpib(
    "mpib_sample2.csv",
    "mpib_test_clean.csv"
)

print("\nAll MPIB datasets processed successfully.")