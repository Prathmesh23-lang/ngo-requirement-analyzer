import re
from typing import Tuple, Dict, List

CATEGORY_RULES: Dict[str, Dict] = {
    "Education": {
        "keywords": [
            "teach", "education", "school", "children", "students", "classes", "math",
            "mathematics", "computer skills", "curriculum", "tutor", "training", "learning",
            "literacy", "study", "underprivileged children", "coaching", "stem", "academic"
        ],
        "weight": 1.2,
        "subcategories": {
            "Teaching & Training": ["teach", "tutor", "class", "classes", "mathematics", "computer basics", "math", "instruction"],
            "Curriculum & Mentorship": ["curriculum", "mentor", "mentoring", "guidance", "counseling", "career"],
            "Literacy & Foundation": ["reading", "literacy", "alphabet", "basic learning", "elementary", "phonetics"],
        },
        "default_subcategory": "Teaching & Training"
    },
    "Healthcare": {
        "keywords": [
            "health", "healthcare", "medical", "doctor", "nurse", "patient", "clinic",
            "hospital", "medicine", "first aid", "blood donation", "vaccination", "camp",
            "mental health", "hygiene", "checkup", "therapy", "diagnosis"
        ],
        "weight": 1.3,
        "subcategories": {
            "Medical Camps & Checkups": ["camp", "checkup", "doctor", "clinic", "screening", "diagnosis"],
            "First Aid & Emergency Care": ["first aid", "emergency", "cpr", "ambulance", "trauma"],
            "Health Awareness & Hygiene": ["hygiene", "sanitation", "nutrition", "mental health", "wellness", "awareness"],
        },
        "default_subcategory": "Medical Camps & Checkups"
    },
    "Environment": {
        "keywords": [
            "environment", "tree", "plantation", "plants", "green", "nature", "forest",
            "waste", "recycling", "clean", "clean-up", "climate", "conservation", "pollution",
            "sapling", "eco", "biodiversity", "water bodies"
        ],
        "weight": 1.2,
        "subcategories": {
            "Tree Plantation & Afforestation": ["tree", "plantation", "sapling", "forest", "greening"],
            "Waste Management & Clean-up": ["waste", "recycling", "clean", "clean-up", "plastic", "garbage"],
            "Climate & Conservation": ["climate", "conservation", "water", "pollution", "biodiversity"],
        },
        "default_subcategory": "Tree Plantation & Afforestation"
    },
    "Technology": {
        "keywords": [
            "website", "web development", "software", "app", "application", "technology",
            "tech", "programming", "python", "developer", "coding", "database", "it support",
            "ui/ux", "frontend", "backend", "code", "portal"
        ],
        "weight": 1.25,
        "subcategories": {
            "Web & App Development": ["website", "web development", "app", "mobile app", "portal", "frontend", "backend"],
            "IT Support & Digital Literacy": ["it support", "hardware", "software", "network", "system setup"],
            "Data & Systems Management": ["database", "analytics", "sql", "automation", "python", "data processing"],
        },
        "default_subcategory": "Web & App Development"
    },
    "Community Service": {
        "keywords": [
            "community", "relief", "food", "ration", "distribution", "underprivileged",
            "slum", "homeless", "hunger", "social service", "elderly", "orphanage", "shelter",
            "flood relief", "earthquake", "disaster response"
        ],
        "weight": 1.1,
        "subcategories": {
            "Relief & Food Distribution": ["food", "ration", "distribution", "relief", "meal", "hunger", "flood", "disaster"],
            "Elderly & Child Care": ["elderly", "old age", "orphanage", "shelter", "child welfare"],
            "Community Outreach & Upliftment": ["slum", "grassroots", "outreach", "mobilization", "social reform"],
        },
        "default_subcategory": "Relief & Food Distribution"
    },
    "Fundraising": {
        "keywords": [
            "fundraising", "fund raising", "funds", "donation", "crowdfunding", "donor",
            "charity drive", "raise money", "sponsorship", "grants", "financial aid", "campaign funding"
        ],
        "weight": 1.2,
        "subcategories": {
            "Campaign Crowdfunding": ["crowdfunding", "online campaign", "social fundraising", "platform"],
            "Donor Relations & Outreach": ["donor", "sponsorship", "partnerships", "corporate", "csr"],
            "Charity Events & Drives": ["charity drive", "gala", "auction", "fundraising event"],
        },
        "default_subcategory": "Campaign Crowdfunding"
    },
    "Marketing & Social Media": {
        "keywords": [
            "social media", "instagram", "facebook", "marketing", "posters", "graphic design",
            "digital marketing", "seo", "branding", "pr", "promot", "campaign", "reels",
            "content creation", "flyer", "banner"
        ],
        "weight": 1.2,
        "subcategories": {
            "Social Media Management": ["instagram", "facebook", "twitter", "linkedin", "reels", "posts"],
            "Graphic & Content Creation": ["posters", "graphic design", "canva", "flyer", "video", "content writing"],
            "Public Relations & Campaigns": ["branding", "pr", "promotion", "awareness drive", "digital marketing"],
        },
        "default_subcategory": "Social Media Management"
    },
    "Event Management": {
        "keywords": [
            "event", "conference", "marathon", "gathering", "annual day", "festival",
            "ground coordination", "stage", "venue", "logistics", "hospitality", "registration desk"
        ],
        "weight": 1.1,
        "subcategories": {
            "On-ground Operations": ["on-ground", "venue", "registration", "hospitality", "ushering"],
            "Logistics & Planning": ["logistics", "supplies", "transport", "coordination", "equipment"],
            "Media & Stage Management": ["stage", "sound", "lighting", "emcee", "anchor"],
        },
        "default_subcategory": "On-ground Operations"
    },
    "Administration": {
        "keywords": [
            "administrative", "administration", "office", "data entry", "documentation",
            "filing", "excel", "records", "back office", "clerical", "phone calls"
        ],
        "weight": 1.0,
        "subcategories": {
            "Data Entry & Operations": ["data entry", "excel", "spreadsheet", "records"],
            "Documentation & Clerical": ["documentation", "filing", "clerical", "reports"],
            "Office Support": ["office", "reception", "calls", "scheduling"],
        },
        "default_subcategory": "Data Entry & Operations"
    },
    "Legal": {
        "keywords": [
            "legal", "law", "advocacy", "rights", "compliance", "lawyer", "court",
            "justice", "legal aid", "statutory", "policy", "affidavit", "rti"
        ],
        "weight": 1.3,
        "subcategories": {
            "Legal Aid & Consultation": ["legal aid", "lawyer", "consultation", "advice"],
            "Rights & Compliance": ["rights", "compliance", "statutory", "rti"],
            "Policy & Advocacy": ["policy", "advocacy", "justice", "reform"],
        },
        "default_subcategory": "Legal Aid & Consultation"
    }
}

def classify_category(title: str, description: str) -> Tuple[str, str, float]:
    """
    Classifies the text into (Category, Subcategory, Confidence).
    Uses weighted keyword frequency with title prioritization.
    """
    combined_text = f"{title} {title} {description}".lower()
    
    scores: Dict[str, float] = {}

    for cat_name, info in CATEGORY_RULES.items():
        score = 0.0
        for kw in info["keywords"]:
            # Check occurrence
            count = len(re.findall(r"\b" + re.escape(kw) + r"\b", combined_text))
            if count > 0:
                score += count * 2.0
            elif kw in combined_text:
                score += 1.0

        scores[cat_name] = score * info["weight"]

    # Pick the top category
    sorted_cats = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_cat, best_score = sorted_cats[0]

    if best_score <= 1.0:
        return "Community Service", "General Volunteer Support", 0.65

    # Determine subcategory
    cat_info = CATEGORY_RULES[best_cat]
    best_subcat = cat_info["default_subcategory"]
    subcat_score_max = 0

    for subcat_name, subcat_kws in cat_info.get("subcategories", {}).items():
        s_score = 0
        for skw in subcat_kws:
            if skw in combined_text:
                s_score += 1
        if s_score > subcat_score_max:
            subcat_score_max = s_score
            best_subcat = subcat_name

    # Calculate confidence ratio
    confidence = min(0.98, max(0.72, (best_score / (best_score + 5.0)) + 0.15))
    return best_cat, best_subcat, round(confidence, 2)
