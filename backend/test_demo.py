import asyncio
from app.ai.analyzer import analyze_ngo_request
from app.database import SessionLocal
from app.models.volunteer import Volunteer
from app.models.ngo_request import NGORequest
from app.services.matching_engine import rank_volunteers_for_request

async def test_demo():
    title = "Weekend Education Program"
    desc = "We are organizing a weekend education program for underprivileged children. We need volunteers who can teach mathematics and basic computer skills. Volunteers should be comfortable communicating with children and should preferably be available on weekends in Pune."
    
    analysis = await analyze_ngo_request(title, desc)
    print("=== AI ANALYSIS RESULTS ===")
    print(f"Category: {analysis['category']}")
    print(f"Subcategory: {analysis['subcategory']}")
    print(f"Urgency: {analysis['urgency']}")
    print(f"Urgency Reason: {analysis['urgency_reason']}")
    print(f"Extracted Skills: {analysis['extracted_skills']}")

    db = SessionLocal()
    volunteers = db.query(Volunteer).filter(Volunteer.status == "Active").all()
    req = NGORequest(
        title=title,
        location="Pune",
        availability="Weekends",
        category=analysis["category"],
        subcategory=analysis["subcategory"]
    )
    ranked = rank_volunteers_for_request(req, analysis["extracted_skills"], volunteers)
    print("\n=== TOP RECOMMENDED VOLUNTEERS ===")
    for r in ranked[:5]:
        v = r["volunteer"]
        print(f"\n{r['rank']}. {v.name} — {r['match_score']}% Match")
        print(f"   Skills: {', '.join(v.skills)}")
        print(f"   Location: {v.location} | Availability: {v.availability} | Experience: {v.experience_years} yrs")
        print("   Why Recommended:")
        for reason in r["match_reasons"]:
            print(f"     {reason}")
    db.close()

if __name__ == "__main__":
    asyncio.run(test_demo())
