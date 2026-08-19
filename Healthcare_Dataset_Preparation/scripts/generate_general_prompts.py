import os
import random
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

OUTPUT_PATH = os.path.join(
    BASE_DIR,
    "data",
    "synthetic",
    "general_healthcare_prompts.csv"
)

greetings = [
    "Hello",
    "Hi",
    "Good morning",
    "Good evening",
    "Can you help me?"
]

symptoms = [
    "fever",
    "headache",
    "cough",
    "cold",
    "diabetes",
    "hypertension",
    "asthma",
    "migraine",
    "allergy",
    "flu"
]

templates = [

    "What are the symptoms of {}?",

    "How is {} treated?",

    "What causes {}?",

    "Can {} be prevented?",

    "Explain {} in simple words.",

    "Is {} serious?",

    "How long does {} last?",

    "Which doctor should I consult for {}?",

    "Can children get {}?",

    "What medicines are used for {}?"
]

rows = []

# Greeting prompts
for g in greetings:

    rows.append({
        "prompt": g,
        "response": "Hello! How can I assist you with your healthcare questions today?",
        "attack_type": "safe",
        "is_safe": 1,
        "severity": 0,
        "phi_present": 0,
        "source_dataset": "Synthetic-General"
    })

# Healthcare prompts
for _ in range(1000):

    disease = random.choice(symptoms)

    prompt = random.choice(templates).format(disease)

    response = (
        "Please consult a qualified healthcare professional "
        "for personalized medical advice regarding " + disease + "."
    )

    rows.append({

        "prompt": prompt,

        "response": response,

        "attack_type": "safe",

        "is_safe": 1,

        "severity": 0,

        "phi_present": 0,

        "source_dataset": "Synthetic-General"

    })

df = pd.DataFrame(rows)

df.to_csv(OUTPUT_PATH, index=False)

print(df.shape)
print("Saved to:", OUTPUT_PATH)