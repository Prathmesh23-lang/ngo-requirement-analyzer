import re
from typing import List, Dict, Set

# Comprehensive catalog mapping canonical skill names to synonyms, aliases, and trigger terms
SKILL_PATTERNS: Dict[str, List[str]] = {
    "Teaching": [
        r"\bteach(?:ing|es|er)?\b",
        r"\btutor(?:ing|s)?\b",
        r"\beducat(?:ion|or|ing)\b",
        r"\binstruct(?:or|ion|ing)?\b",
        r"\bclasses\b",
        r"\bpedagogy\b",
        r"\blessons?\b",
    ],
    "Mathematics": [
        r"\bmath(?:ematic|ematics|s)?\b",
        r"\barithmetic\b",
        r"\balgebra\b",
        r"\bgeometry\b",
        r"\bcalculus\b",
        r"\bnumeracy\b",
    ],
    "Computer Skills": [
        r"\bcomputer\s+skills?\b",
        r"\bbasic\s+computers?\b",
        r"\bcomputer\s+basics?\b",
        r"\bcomputer\s+literacy\b",
        r"\bdigital\s+literacy\b",
        r"\bms\s+office\b",
        r"\bexcel\b",
        r"\bword\b",
        r"\bpowerpoint\b",
        r"\btyping\b",
        r"\bpc\s+literate\b",
        r"\bsoftware\s+basics?\b",
    ],
    "Communication": [
        r"\bcommunicat(?:ion|ing|e|ive)\b",
        r"\binterpersonal\s+skills?\b",
        r"\bverbal\s+skills?\b",
        r"\bsoft\s+skills?\b",
        r"\bconversational\b",
        r"\blistening\s+skills?\b",
    ],
    "Public Speaking": [
        r"\bpublic\s+speaking\b",
        r"\borat(?:ory|or)\b",
        r"\bspeech(?:es)?\b",
        r"\bpresentation\s+skills?\b",
        r"\banchor(?:ing)?\b",
    ],
    "Python": [
        r"\bpython\b",
        r"\bdjango\b",
        r"\bflask\b",
        r"\bfastapi\b",
        r"\bpandas\b",
        r"\bnumpy\b",
    ],
    "Web Development": [
        r"\bweb\s+develop(?:ment|er)?\b",
        r"\bwebsite(?:s)?\b",
        r"\bweb\s+design\b",
        r"\bfrontend\b",
        r"\bfront-end\b",
        r"\bbackend\b",
        r"\bback-end\b",
        r"\bfullstack\b",
        r"\bhtml\b",
        r"\bcss\b",
        r"\bjavascript\b",
        r"\breact(?:js)?\b",
        r"\bnext(?:js)?\b",
        r"\bnode(?:js)?\b",
        r"\bwordpress\b",
    ],
    "Graphic Design": [
        r"\bgraphic\s+design(?:er|ing)?\b",
        r"\bposter\s+design\b",
        r"\bdesign(?:ing)?\s+posters?\b",
        r"\bcanva\b",
        r"\bphotoshop\b",
        r"\billustrator\b",
        r"\bflyer(?:s)?\b",
        r"\bbanner(?:s)?\b",
        r"\bcreative\s+design\b",
        r"\bvisual\s+design\b",
    ],
    "UI/UX Design": [
        r"\bui\s*/\s*ux\b",
        r"\bui\s+design\b",
        r"\bux\s+design\b",
        r"\buser\s+experience\b",
        r"\buser\s+interface\b",
        r"\bfigma\b",
        r"\bwirefram(?:e|ing)\b",
        r"\bprototyp(?:e|ing)\b",
    ],
    "Social Media Management": [
        r"\bsocial\s+media(?:\s+management|\s+handling|\s+marketing)?\b",
        r"\binstagram\b",
        r"\bfacebook\b",
        r"\btwitter\b",
        r"\blinkedin\b",
        r"\bmanage\s+instagram\b",
        r"\bcontent\s+posting\b",
        r"\breels\b",
        r"\bsocial\s+campaigns?\b",
    ],
    "Digital Marketing": [
        r"\bdigital\s+marketing\b",
        r"\bseo\b",
        r"\bsem\b",
        r"\bonline\s+marketing\b",
        r"\bpromote\s+campaign\b",
        r"\bmarketing\s+campaign\b",
        r"\bemail\s+marketing\b",
        r"\bad\s+campaigns?\b",
    ],
    "Content Writing": [
        r"\bcontent\s+writ(?:ing|er)\b",
        r"\bcopywrit(?:ing|er)\b",
        r"\bblog\s+writ(?:ing|er)\b",
        r"\barticle\s+writ(?:ing|er)\b",
        r"\bcontent\s+creat(?:ion|or)\b",
        r"\bcreative\s+writing\b",
        r"\bdocumentation\b",
    ],
    "Fundraising": [
        r"\bfundrais(?:ing|er)\b",
        r"\bfund\s+raising\b",
        r"\bdonation(?:s)?\b",
        r"\bcrowdfund(?:ing)?\b",
        r"\brais(?:ing|e)\s+funds?\b",
        r"\bdonor\s+relations?\b",
        r"\bcharity\s+drive\b",
    ],
    "Event Management": [
        r"\bevent\s+manage(?:ment|r)?\b",
        r"\bevent\s+coordinat(?:ion|or)\b",
        r"\borganiz(?:ing|e)\s+(?:event|program|camp|workshop)\b",
        r"\blogistics\b",
        r"\bon-ground\s+coordination\b",
        r"\bstage\s+management\b",
    ],
    "Photography": [
        r"\bphotograph(?:y|er|s)?\b",
        r"\bphotoshoot\b",
        r"\bcamera\s+work\b",
        r"\bphoto\s+coverage\b",
    ],
    "Video Editing": [
        r"\bvideo\s+edit(?:ing|or)\b",
        r"\bvideo\s+produc(?:tion|er)\b",
        r"\bvideograph(?:y|er)\b",
        r"\bpremiere\s+pro\b",
        r"\bfinal\s+cut\b",
        r"\byoutube\s+video\b",
    ],
    "Healthcare Assistance": [
        r"\bhealth\s*care\b",
        r"\bhealth(?:care)?\s+assist(?:ance|ant)?\b",
        r"\bmedical\s+camp\b",
        r"\bhealth\s+camp\b",
        r"\bpatient\s+care\b",
        r"\bnurs(?:ing|e)\b",
        r"\bclinic\s+support\b",
        r"\bdoctor\s+assist(?:ant)?\b",
    ],
    "First Aid": [
        r"\bfirst\s+aid\b",
        r"\bcpr\b",
        r"\bemergency\s+aid\b",
        r"\btriage\b",
        r"\bmedical\s+first\s+responder\b",
    ],
    "Data Entry": [
        r"\bdata\s+entry\b",
        r"\bdata\s+processing\b",
        r"\bexcel\s+entry\b",
        r"\brecord\s+keeping\b",
        r"\bspreadsheet\s+maintenance\b",
    ],
    "Administration": [
        r"\badministrat(?:ion|ive|or)\b",
        r"\boffice\s+support\b",
        r"\boffice\s+management\b",
        r"\bclerical\b",
        r"\boperational\s+support\b",
        r"\bvolunteer\s+coordination\b",
    ],
    "Legal Assistance": [
        r"\blegal\s+(?:aid|assistance|advice|support)\b",
        r"\blawyer\b",
        r"\badvoca(?:cy|te)\b",
        r"\brights\s+awareness\b",
        r"\bcompliance\b",
        r"\bparalegal\b",
    ],
    "Environmental Awareness": [
        r"\benvironment(?:al)?\b",
        r"\btree\s+plantation\b",
        r"\bsapling(?:s)?\b",
        r"\bafforestation\b",
        r"\bwaste\s+management\b",
        r"\bclean(?:-|\s)?up\s+drive\b",
        r"\bclimate\s+action\b",
        r"\brecycling\b",
    ],
    "Community Outreach": [
        r"\bcommunity\s+outreach\b",
        r"\bunderprivileged\b",
        r"\bslum\b",
        r"\bfield\s+work\b",
        r"\bsocial\s+work(?:er)?\b",
        r"\bgrassroots\b",
        r"\bfood\s+distribution\b",
        r"\brelief\s+distribution\b",
    ],
    "Child Care": [
        r"\bchildren\b",
        r"\bchild\s+care\b",
        r"\bchild\s+psychology\b",
        r"\bworking\s+with\s+children\b",
        r"\byouth\s+mentoring\b",
        r"\bkids\b",
    ],
    "Science": [
        r"\bscience\b",
        r"\bphysics\b",
        r"\bchemistry\b",
        r"\bbiology\b",
        r"\bstem\b",
        r"\bscientific\b",
    ],
    "English": [
        r"\benglish\b",
        r"\bspoken\s+english\b",
        r"\bphonetics\b",
        r"\blanguage\s+training\b",
    ],
}

def extract_skills_from_text(text: str, additional_skills: List[str] = None) -> List[str]:
    """
    Extracts canonical skill names from natural language text using regex pattern matching.
    Optionally merges and deduplicates any user-provided additional skills.
    """
    if not text:
        return additional_skills or []

    found_skills: Set[str] = set()
    cleaned_text = text.lower()

    for skill_name, patterns in SKILL_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, cleaned_text, re.IGNORECASE):
                found_skills.add(skill_name)
                break

    # Add user optional skills if supplied
    if additional_skills:
        for skill in additional_skills:
            if skill and skill.strip():
                # Check if it matches a canonical skill, or add trimmed as is
                canonical_match = None
                for canon in SKILL_PATTERNS.keys():
                    if canon.lower() == skill.strip().lower():
                        canonical_match = canon
                        break
                found_skills.add(canonical_match or skill.strip().title())

    # Prioritize key skills and return as sorted list
    return sorted(list(found_skills))
