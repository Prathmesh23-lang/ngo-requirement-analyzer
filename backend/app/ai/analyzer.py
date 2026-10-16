from typing import List, Dict, Any, Optional
from app.ai.category_classifier import classify_category
from app.ai.skill_catalog import extract_skills_from_text
from app.ai.urgency_detector import detect_urgency
from app.ai.llm_service import analyze_with_llm

async def analyze_ngo_request(
    title: str,
    description: str,
    optional_skills: Optional[List[str]] = None,
    user_urgency: Optional[str] = "Auto"
) -> Dict[str, Any]:
    """
    Analyzes an NGO request to extract category, subcategory, skills, urgency, and summary.
    Works 100% offline with deterministic, explainable NLP, while supporting optional LLM enhancement.
    """
    # 1. Try external LLM if configured
    llm_result = await analyze_with_llm(title, description)
    if llm_result:
        # Normalize extracted skills with canonical catalog
        raw_skills = llm_result.get("extracted_skills", [])
        canonical_skills = extract_skills_from_text(
            f"{title} {description} {' '.join(raw_skills)}", 
            optional_skills
        )
        llm_result["extracted_skills"] = canonical_skills
        return llm_result

    # 2. Local Hybrid NLP Analysis Pipeline
    category, subcategory, confidence = classify_category(title, description)
    
    extracted_skills = extract_skills_from_text(
        f"{title} {description}", 
        additional_skills=optional_skills
    )

    urgency, urgency_reason = detect_urgency(
        f"{title} {description}", 
        user_selected=user_urgency or "Auto"
    )

    skill_str = ", ".join(extracted_skills[:3]) if extracted_skills else "General Support"
    summary = f"NGO initiative categorized under {category} ({subcategory}). Seeking volunteers with competencies including {skill_str}."

    return {
        "category": category,
        "subcategory": subcategory,
        "extracted_skills": extracted_skills,
        "urgency": urgency,
        "urgency_reason": urgency_reason,
        "category_confidence": confidence,
        "summary": summary,
        "analysis_method": "Hybrid NLP Engine",
    }
