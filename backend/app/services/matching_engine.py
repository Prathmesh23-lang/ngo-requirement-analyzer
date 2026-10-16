from typing import List, Dict, Any, Tuple
from app.models.volunteer import Volunteer
from app.models.ngo_request import NGORequest

def calculate_volunteer_match(
    request: NGORequest,
    extracted_skills: List[str],
    volunteer: Volunteer
) -> Tuple[float, List[str], List[str], Dict[str, float]]:
    """
    Computes a transparent, explainable match score (0-100%) between an NGO requirement and a volunteer.
    Weights:
      - Skill Match: 50%
      - Location Match: 20%
      - Availability Match: 15%
      - Experience Match: 10%
      - Category / Interest Match: 5%
    """
    reasons: List[str] = []
    vol_skills = [s.strip().lower() for s in (volunteer.skills or [])]
    req_skills = [s.strip().lower() for s in (extracted_skills or [])]

    # 1. Skill Match (Max 50 pts)
    matched_skills_canonical: List[str] = []
    overlap_count = 0

    if req_skills and vol_skills:
        for orig_vol_skill, low_vol_skill in zip(volunteer.skills or [], vol_skills):
            matched = False
            for orig_req_skill, low_req_skill in zip(extracted_skills, req_skills):
                if low_req_skill == low_vol_skill or low_req_skill in low_vol_skill or low_vol_skill in low_req_skill:
                    matched = True
                    break
            if matched:
                overlap_count += 1
                matched_skills_canonical.append(orig_vol_skill)
                reasons.append(f"✓ {orig_vol_skill} matches required skill")

        if overlap_count >= 3:
            skill_score = 46.0 + min(4.0, (overlap_count / len(vol_skills)) * 4.0)
        elif overlap_count == 2:
            skill_score = 38.0 + min(4.0, (overlap_count / len(vol_skills)) * 4.0)
        elif overlap_count == 1:
            skill_score = 28.0 + min(4.0, (overlap_count / len(vol_skills)) * 4.0)
        else:
            skill_score = 8.0
    else:
        skill_score = 20.0
        reasons.append("✓ General volunteer capabilities match open requirement")

    skill_score = min(50.0, round(skill_score, 1))

    # 2. Location Match (Max 20 pts)
    location_score = 0.0
    req_loc = (request.location or "").strip().lower()
    vol_loc = (volunteer.location or "").strip().lower()

    if req_loc and vol_loc:
        if req_loc == vol_loc or req_loc in vol_loc or vol_loc in req_loc:
            location_score = 20.0
            reasons.append(f"✓ Located in {volunteer.location} (matches request location)")
        elif "remote" in vol_loc or "online" in vol_loc or "remote" in req_loc:
            location_score = 14.0
            reasons.append("✓ Available for remote/online engagement")
        else:
            location_score = 0.0
    else:
        location_score = 10.0

    # 3. Availability Match (Max 15 pts)
    availability_score = 0.0
    req_avail = (request.availability or "").strip().lower()
    vol_avail = (volunteer.availability or "").strip().lower()

    if req_avail and vol_avail:
        if vol_avail == "flexible":
            availability_score = 15.0
            reasons.append("✓ Flexible schedule readily adapts to project needs")
        elif req_avail in vol_avail or vol_avail in req_avail:
            availability_score = 15.0
            reasons.append(f"✓ Available on {volunteer.availability} (matches preferred schedule)")
        elif "weekend" in req_avail and "weekend" in vol_avail:
            availability_score = 15.0
            reasons.append("✓ Available on weekends (matches requested schedule)")
        elif "weekday" in req_avail and "weekday" in vol_avail:
            availability_score = 15.0
            reasons.append("✓ Available on weekdays (matches requested schedule)")
        else:
            availability_score = 4.0
    else:
        availability_score = 10.0

    # 4. Experience Match (Max 10 pts)
    exp = volunteer.experience_years or 0.0
    if exp >= 3.0:
        experience_score = 10.0
        reasons.append(f"✓ Strong experience ({exp:g} years)")
    elif exp >= 2.0:
        experience_score = 9.0
        reasons.append(f"✓ Has {exp:g} years of relevant experience")
    elif exp >= 1.0:
        experience_score = 7.0
        reasons.append(f"✓ Has {exp:g} year(s) of baseline experience")
    else:
        experience_score = 4.0

    # 5. Category / Interest Match (Max 5 pts)
    interest_score = 0.0
    req_category = (request.category or "").strip().lower()
    vol_interests = [i.strip().lower() for i in (volunteer.interests or [])]

    if req_category:
        for interest in vol_interests:
            if req_category in interest or interest in req_category:
                interest_score = 5.0
                reasons.append(f"✓ Direct interest in {request.category}")
                break
        if interest_score == 0.0 and vol_interests:
            interest_score = 2.0
    else:
        interest_score = 3.0

    total_score = round(skill_score + location_score + availability_score + experience_score + interest_score, 1)
    total_score = max(0.0, min(100.0, total_score))

    breakdown = {
        "skill_score": skill_score,
        "location_score": location_score,
        "availability_score": availability_score,
        "experience_score": experience_score,
        "interest_score": interest_score,
        "total_score": total_score
    }

    return total_score, matched_skills_canonical, reasons, breakdown

def rank_volunteers_for_request(
    request: NGORequest,
    extracted_skills: List[str],
    volunteers: List[Volunteer]
) -> List[Dict[str, Any]]:
    """
    Ranks volunteers based on match score against the NGO request.
    Returns ranked list with explanations.
    """
    results = []
    for vol in volunteers:
        score, matched_skills, reasons, breakdown = calculate_volunteer_match(
            request, extracted_skills, vol
        )
        results.append({
            "volunteer": vol,
            "volunteer_id": vol.id,
            "match_score": score,
            "matched_skills": matched_skills,
            "match_reasons": reasons,
            "score_breakdown": breakdown,
        })

    # Sort descending by match_score
    results.sort(key=lambda x: x["match_score"], reverse=True)

    # Assign 1-indexed ranks
    for idx, item in enumerate(results):
        item["rank"] = idx + 1

    return results
