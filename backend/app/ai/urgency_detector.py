import re
from typing import Tuple

HIGH_URGENCY_KEYWORDS = [
    r"\burgent(?:ly)?\b",
    r"\bemergency\b",
    r"\bflooding\b",
    r"\bflood(?:s)?\b",
    r"\bdisaster\b",
    r"\basap\b",
    r"\bimmediat(?:ely)?\b",
    r"\bcritical\b",
    r"\bcrisis\b",
    r"\brescue\b",
    r"\btoday\b",
    r"\bwithin\s+24\s+hours\b",
    r"\bstarv(?:ation|ing)\b",
    r"\bshortage\b",
    r"\blife-threatening\b",
]

MEDIUM_URGENCY_KEYWORDS = [
    r"\bupcoming\b",
    r"\bthis\s+weekend\b",
    r"\bnext\s+week\b",
    r"\bweekend\b",
    r"\borganizing\b",
    r"\bscheduled\b",
    r"\bsoon\b",
    r"\bwithin\s+a\s+week\b",
    r"\bplanned\b",
    r"\bforthcoming\b",
    r"\bexpected\b",
    r"\bdrive\b",
    r"\bcampaign\b",
]

LOW_URGENCY_KEYWORDS = [
    r"\blong-term\b",
    r"\blong\s+term\b",
    r"\broutine\b",
    r"\bwhenever\b",
    r"\bflexible\b",
    r"\bongoing\b",
    r"\bcontinuous\b",
    r"\bregular\b",
    r"\bgradual\b",
    r"\bno\s+rush\b",
]

def detect_urgency(text: str, user_selected: str = "Auto") -> Tuple[str, str]:
    """
    Analyzes the text to detect urgency and provide an explainable reason.
    If user_selected is explicitly Low/Medium/High, validates or honors it with explanation.
    """
    cleaned = text.lower()

    # Check for High urgency triggers
    for pat in HIGH_URGENCY_KEYWORDS:
        if re.search(pat, cleaned):
            return "High", "Critical emergency, crisis relief, or immediate assistance keywords detected."

    # Check for Low urgency triggers
    for pat in LOW_URGENCY_KEYWORDS:
        if re.search(pat, cleaned):
            return "Low", "Routine, long-term, or flexible engagement schedule identified."

    # Check for Medium urgency triggers
    for pat in MEDIUM_URGENCY_KEYWORDS:
        if re.search(pat, cleaned):
            return "Medium", "Time-sensitive program or scheduled upcoming event requiring active volunteer mobilization."

    # Fallback to user choice or Medium default
    if user_selected in ["Low", "Medium", "High"]:
        return user_selected, f"Urgency aligned with NGO specified priority ({user_selected})."

    return "Medium", "Standard volunteer request with balanced preparation timeframe."
