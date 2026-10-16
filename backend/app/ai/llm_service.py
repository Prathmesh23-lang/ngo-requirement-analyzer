import json
import logging
from typing import Optional, Dict, Any
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

async def analyze_with_llm(title: str, description: str) -> Optional[Dict[str, Any]]:
    """
    Attempts to analyze the NGO requirement using an external LLM if an API key is provided.
    Returns None if no API key is present or if any network/parsing error occurs,
    gracefully activating the built-in offline hybrid NLP pipeline.
    """
    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            prompt = f"""
You are an expert NGO requirement analyzer. Analyze this NGO volunteer request:
Title: {title}
Description: {description}

Return ONLY a valid JSON object with these exact keys:
{{
  "category": "Education" | "Healthcare" | "Environment" | "Technology" | "Community Service" | "Fundraising" | "Event Management" | "Marketing & Social Media" | "Administration" | "Legal" | "Other",
  "subcategory": "string",
  "extracted_skills": ["Skill 1", "Skill 2"],
  "urgency": "Low" | "Medium" | "High",
  "urgency_reason": "string explaining why",
  "category_confidence": 0.95,
  "summary": "1-2 sentence executive summary of the need"
}}
"""
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"response_mime_type": "application/json"}
            }
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = json.loads(raw_text)
                    parsed["analysis_method"] = "Gemini AI"
                    return parsed
        except Exception as e:
            logger.warning(f"Gemini LLM analysis failed, falling back to local NLP engine: {e}")

    return None
