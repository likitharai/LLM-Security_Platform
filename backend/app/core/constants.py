from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ThreatCategory(str, Enum):
    PROMPT_INJECTION = "PROMPT_INJECTION"
    JAILBREAK = "JAILBREAK"
    PHI_PII_LEAK = "PHI_PII_LEAK"
    BEHAVIORAL_ANOMALY = "BEHAVIORAL_ANOMALY"
    MALICIOUS_INTENT = "MALICIOUS_INTENT"

class PolicyAction(str, Enum):
    ALLOW = "ALLOW"
    MASK = "MASK"
    WARN = "WARN"
    BLOCK = "BLOCK"

class EntityType(str, Enum):
    SSN = "SSN"
    CREDIT_CARD = "CREDIT_CARD"
    EMAIL = "EMAIL"
    PHONE_NUMBER = "PHONE_NUMBER"
    MEDICAL_RECORD_NUMBER = "MEDICAL_RECORD_NUMBER"
    NAME = "NAME"