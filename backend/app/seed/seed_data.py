import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models.ngo_request import NGORequest
from app.models.volunteer import Volunteer
from app.models.analysis_result import AnalysisResult
from app.models.recommendation import Recommendation
from app.services.matching_engine import rank_volunteers_for_request
from app.ai.analyzer import analyze_ngo_request

SAMPLE_VOLUNTEERS = [
    {
        "name": "Rahul Sharma",
        "email": "rahul.sharma@example.com",
        "phone": "+91 98201 11223",
        "location": "Pune",
        "skills": ["Mathematics", "Teaching", "Communication"],
        "experience_years": 2.0,
        "availability": "Weekends",
        "interests": ["Education", "Community Service"],
        "description": "Passionate volunteer tutor with 2 years of teaching experience for primary and middle school students. Enjoys making math intuitive.",
        "status": "Active"
    },
    {
        "name": "Sneha Patil",
        "email": "sneha.patil@example.com",
        "phone": "+91 98202 22334",
        "location": "Pune",
        "skills": ["Computer Skills", "Teaching", "Web Development"],
        "experience_years": 3.0,
        "availability": "Weekends",
        "interests": ["Education", "Technology"],
        "description": "IT engineer who loves conducting digital literacy workshops and teaching computer basics and coding to children.",
        "status": "Active"
    },
    {
        "name": "Amit Joshi",
        "email": "amit.joshi@example.com",
        "phone": "+91 98203 33445",
        "location": "Pune",
        "skills": ["Mathematics", "Science", "Teaching"],
        "experience_years": 4.0,
        "availability": "Weekends",
        "interests": ["Education"],
        "description": "High school educator dedicated to science and mathematics mentoring in underserved community centers.",
        "status": "Active"
    },
    {
        "name": "Neha Kulkarni",
        "email": "neha.kulkarni@example.com",
        "phone": "+91 98204 44556",
        "location": "Pune",
        "skills": ["Communication", "Child Care", "Public Speaking"],
        "experience_years": 2.0,
        "availability": "Weekends",
        "interests": ["Education", "Community Outreach"],
        "description": "Empathetic community worker experienced in interacting with children, storytelling, and motivating students.",
        "status": "Active"
    },
    {
        "name": "Rohan Deshmukh",
        "email": "rohan.deshmukh@example.com",
        "phone": "+91 98205 55667",
        "location": "Pune",
        "skills": ["Computer Skills", "Data Entry", "Mathematics"],
        "experience_years": 1.0,
        "availability": "Flexible",
        "interests": ["Education"],
        "description": "BSc graduate experienced in spreadsheet maintenance and basic computer fundamentals.",
        "status": "Active"
    },
    {
        "name": "Priya Nair",
        "email": "priya.nair@example.com",
        "phone": "+91 98206 66778",
        "location": "Mumbai",
        "skills": ["Graphic Design", "Social Media Management", "Digital Marketing"],
        "experience_years": 3.0,
        "availability": "Weekdays",
        "interests": ["Marketing & Social Media", "Fundraising"],
        "description": "Creative visual designer specializing in campaign posters, Instagram graphics, and online awareness branding.",
        "status": "Active"
    },
    {
        "name": "Vikram Malhotra",
        "email": "vikram.malhotra@example.com",
        "phone": "+91 98207 77889",
        "location": "Mumbai",
        "skills": ["Fundraising", "Event Management", "Public Speaking"],
        "experience_years": 5.0,
        "availability": "Weekends",
        "interests": ["Fundraising", "Event Management"],
        "description": "Senior corporate relations volunteer with extensive track record in charity galas, donor acquisition, and crowdfund management.",
        "status": "Active"
    },
    {
        "name": "Ananya Iyer",
        "email": "ananya.iyer@example.com",
        "phone": "+91 98208 88990",
        "location": "Bangalore",
        "skills": ["Web Development", "Python", "UI/UX Design"],
        "experience_years": 4.0,
        "availability": "Flexible",
        "interests": ["Technology"],
        "description": "Fullstack web developer helping non-profits build clean, accessible portals and modern responsive websites.",
        "status": "Active"
    },
    {
        "name": "Rajesh Verma",
        "email": "rajesh.verma@example.com",
        "phone": "+91 98209 99001",
        "location": "Delhi",
        "skills": ["Healthcare Assistance", "First Aid", "Community Outreach"],
        "experience_years": 3.5,
        "availability": "Weekends",
        "interests": ["Healthcare"],
        "description": "Paramedical professional regularly volunteering for health screening drives, mobile clinics, and patient triage.",
        "status": "Active"
    },
    {
        "name": "Pooja Mehta",
        "email": "pooja.mehta@example.com",
        "phone": "+91 98210 10112",
        "location": "Pune",
        "skills": ["Content Writing", "Social Media Management", "Photography"],
        "experience_years": 2.0,
        "availability": "Weekends",
        "interests": ["Marketing & Social Media"],
        "description": "Content creator passionate about photo-documenting social initiatives and writing compelling community stories.",
        "status": "Active"
    },
    {
        "name": "Deepak Kumar",
        "email": "deepak.kumar@example.com",
        "phone": "+91 98211 12123",
        "location": "Pune",
        "skills": ["Environmental Awareness", "Community Outreach", "Event Management"],
        "experience_years": 3.0,
        "availability": "Weekends",
        "interests": ["Environment"],
        "description": "Ecological activist who has coordinated over 20 tree plantation drives and urban waste segregation workshops.",
        "status": "Active"
    },
    {
        "name": "Kavita Rao",
        "email": "kavita.rao@example.com",
        "phone": "+91 98212 13134",
        "location": "Hyderabad",
        "skills": ["Legal Assistance", "Administration", "Communication"],
        "experience_years": 5.0,
        "availability": "Weekdays",
        "interests": ["Legal"],
        "description": "Advocate providing pro-bono guidance for non-profit registrations, statutory compliances, and citizen rights literacy.",
        "status": "Active"
    },
    {
        "name": "Siddharth Roy",
        "email": "siddharth.roy@example.com",
        "phone": "+91 98213 14145",
        "location": "Kolkata",
        "skills": ["Video Editing", "Photography", "Graphic Design"],
        "experience_years": 2.5,
        "availability": "Flexible",
        "interests": ["Marketing & Social Media"],
        "description": "Video producer adept at crafting short documentaries and impact reels for social benefit campaigns.",
        "status": "Active"
    },
    {
        "name": "Sunita Bansal",
        "email": "sunita.bansal@example.com",
        "phone": "+91 98214 15156",
        "location": "Delhi",
        "skills": ["First Aid", "Healthcare Assistance", "Child Care"],
        "experience_years": 4.0,
        "availability": "Weekends",
        "interests": ["Healthcare"],
        "description": "Certified first aid instructor with hospital volunteering background and emergency medical response skills.",
        "status": "Active"
    },
    {
        "name": "Arjun Patel",
        "email": "arjun.patel@example.com",
        "phone": "+91 98215 16167",
        "location": "Ahmedabad",
        "skills": ["Event Management", "Administration", "Logistics"],
        "experience_years": 3.0,
        "availability": "Weekends",
        "interests": ["Community Service"],
        "description": "On-ground operations specialist skilled in venue management, volunteer briefings, and supply logistics.",
        "status": "Active"
    },
    {
        "name": "Meera Sen",
        "email": "meera.sen@example.com",
        "phone": "+91 98216 17178",
        "location": "Bangalore",
        "skills": ["Python", "Computer Skills", "Data Entry"],
        "experience_years": 2.0,
        "availability": "Weekends",
        "interests": ["Technology"],
        "description": "Data enthusiast eager to assist NGOs with database cleaning, basic scripting, and report automation.",
        "status": "Active"
    },
    {
        "name": "Tanvi Chawla",
        "email": "tanvi.chawla@example.com",
        "phone": "+91 98217 18189",
        "location": "Pune",
        "skills": ["Teaching", "English", "Mathematics"],
        "experience_years": 1.5,
        "availability": "Weekends",
        "interests": ["Education"],
        "description": "University student who volunteers every Saturday teaching English phonetics and elementary mathematics.",
        "status": "Active"
    },
    {
        "name": "Aditya Saxena",
        "email": "aditya.saxena@example.com",
        "phone": "+91 98218 19190",
        "location": "Pune",
        "skills": ["Computer Skills", "Communication", "Teaching"],
        "experience_years": 2.5,
        "availability": "Weekends",
        "interests": ["Technology", "Education"],
        "description": "Tech support professional who teaches hardware basics, safe internet browsing, and productivity tools.",
        "status": "Active"
    },
    {
        "name": "Shweta Kadam",
        "email": "shweta.kadam@example.com",
        "phone": "+91 98219 20201",
        "location": "Mumbai",
        "skills": ["Community Outreach", "First Aid", "Event Management"],
        "experience_years": 3.0,
        "availability": "Weekends",
        "interests": ["Community Service"],
        "description": "Grassroots community worker leading ration kit distributions and disaster resilience programs.",
        "status": "Active"
    },
    {
        "name": "Nikhil Gupta",
        "email": "nikhil.gupta@example.com",
        "phone": "+91 98220 21212",
        "location": "Delhi",
        "skills": ["Digital Marketing", "Content Writing", "Social Media Management"],
        "experience_years": 2.0,
        "availability": "Flexible",
        "interests": ["Marketing & Social Media"],
        "description": "Digital strategist skilled at fundraising ad copies, donor email newsletters, and organic search optimization.",
        "status": "Active"
    },
    {
        "name": "Shruti Deshpande",
        "email": "shruti.deshpande@example.com",
        "phone": "+91 98221 22223",
        "location": "Pune",
        "skills": ["Mathematics", "Teaching", "Child Care"],
        "experience_years": 3.0,
        "availability": "Weekends",
        "interests": ["Education"],
        "description": "Math trainer focusing on mental arithmetic and interactive puzzle-based learning for children.",
        "status": "Active"
    },
    {
        "name": "Farhan Ali",
        "email": "farhan.ali@example.com",
        "phone": "+91 98222 23234",
        "location": "Pune",
        "skills": ["Computer Skills", "Communication", "Teaching"],
        "experience_years": 2.0,
        "availability": "Weekends",
        "interests": ["Education"],
        "description": "Dedicated youth volunteer helping high school students build computer confidence and communication skills.",
        "status": "Active"
    }
]

SAMPLE_REQUESTS = [
    {
        "ngo_name": "Helping Hands Foundation",
        "ngo_email": "contact@helpinghandspune.org",
        "location": "Pune",
        "title": "Weekend Education Program",
        "description": "We are organizing a weekend education program for underprivileged children. We need volunteers who can teach mathematics and basic computer skills. Volunteers should be comfortable communicating with children and should preferably be available on weekends in Pune.",
        "volunteers_required": 4,
        "duration": "4 weeks",
        "expected_date": "Next Saturday",
        "availability": "Weekends",
        "urgency": "Medium",
        "days_ago": 2
    },
    {
        "ngo_name": "EcoEarth Initiative",
        "ngo_email": "info@ecoearthindia.org",
        "location": "Pune",
        "title": "Monsoon Tree Plantation Drive",
        "description": "We are conducting a large-scale tree plantation and environmental awareness campaign across public parks. We need volunteers to coordinate sapling distribution, guide visitors, and spread awareness on urban afforestation.",
        "volunteers_required": 6,
        "duration": "1 weekend",
        "expected_date": "Upcoming Sunday",
        "availability": "Weekends",
        "urgency": "Low",
        "days_ago": 4
    },
    {
        "ngo_name": "TechForGood Foundation",
        "ngo_email": "tech@techforgood.org",
        "location": "Bangalore",
        "title": "Website & Donor Portal Development",
        "description": "We need skilled volunteers to develop a modern responsive website and volunteer management portal. Need proficiency in web development, python backend, and UI/UX design.",
        "volunteers_required": 2,
        "duration": "6 weeks",
        "expected_date": "Within 2 weeks",
        "availability": "Flexible",
        "urgency": "Medium",
        "days_ago": 6
    },
    {
        "ngo_name": "Disaster Relief Trust",
        "ngo_email": "sos@reliefindia.org",
        "location": "Mumbai",
        "title": "Emergency Monsoon Flood Relief Distribution",
        "description": "We urgently need volunteers to distribute food rations, drinking water, and first aid kits to families affected by heavy flooding. Immediate assistance needed on-ground!",
        "volunteers_required": 10,
        "duration": "3 days",
        "expected_date": "Immediately",
        "availability": "Weekends",
        "urgency": "High",
        "days_ago": 8
    },
    {
        "ngo_name": "Sanjeevani Care Trust",
        "ngo_email": "camps@sanjeevanicaredelhi.org",
        "location": "Delhi",
        "title": "Free Community Health Camp",
        "description": "Organizing a free general health checkup and first aid awareness camp in suburban community centers. Seeking volunteers with healthcare assistance, first aid, and patient coordination background.",
        "volunteers_required": 5,
        "duration": "2 days",
        "expected_date": "End of month",
        "availability": "Weekends",
        "urgency": "Medium",
        "days_ago": 10
    }
]

async def seed_database():
    """
    Populates the database with realistic volunteers and analyzed NGO requests.
    """
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if volunteers already seeded
        existing_vol_count = db.query(Volunteer).count()
        if existing_vol_count == 0:
            print("Seeding volunteers into database...")
            for vol_data in SAMPLE_VOLUNTEERS:
                vol = Volunteer(
                    name=vol_data["name"],
                    email=vol_data["email"],
                    phone=vol_data["phone"],
                    location=vol_data["location"],
                    skills=vol_data["skills"],
                    experience_years=vol_data["experience_years"],
                    availability=vol_data["availability"],
                    interests=vol_data["interests"],
                    description=vol_data["description"],
                    status=vol_data["status"]
                )
                db.add(vol)
            db.commit()
            print(f"Successfully seeded {len(SAMPLE_VOLUNTEERS)} realistic volunteers.")

        # Check if requests already seeded
        existing_req_count = db.query(NGORequest).count()
        if existing_req_count == 0:
            print("Seeding sample NGO requests and executing AI analysis...")
            volunteers = db.query(Volunteer).filter(Volunteer.status == "Active").all()

            for req_data in SAMPLE_REQUESTS:
                created_dt = datetime.utcnow() - timedelta(days=req_data["days_ago"])
                
                # 1. Base Request
                ngo_req = NGORequest(
                    ngo_name=req_data["ngo_name"],
                    ngo_email=req_data["ngo_email"],
                    location=req_data["location"],
                    title=req_data["title"],
                    description=req_data["description"],
                    volunteers_required=req_data["volunteers_required"],
                    duration=req_data["duration"],
                    expected_date=req_data["expected_date"],
                    availability=req_data["availability"],
                    urgency=req_data["urgency"],
                    status="Analyzed",
                    created_at=created_dt
                )
                db.add(ngo_req)
                db.commit()
                db.refresh(ngo_req)

                # 2. AI Analysis
                analysis = await analyze_ngo_request(
                    title=req_data["title"],
                    description=req_data["description"],
                    user_urgency=req_data["urgency"]
                )

                ngo_req.category = analysis["category"]
                ngo_req.subcategory = analysis["subcategory"]
                ngo_req.urgency = analysis["urgency"]
                db.commit()

                analysis_obj = AnalysisResult(
                    request_id=ngo_req.id,
                    category=analysis["category"],
                    subcategory=analysis["subcategory"],
                    extracted_skills=analysis["extracted_skills"],
                    urgency=analysis["urgency"],
                    urgency_reason=analysis["urgency_reason"],
                    category_confidence=analysis["category_confidence"],
                    summary=analysis["summary"],
                    analysis_method=analysis["analysis_method"],
                    created_at=created_dt
                )
                db.add(analysis_obj)
                db.commit()

                # 3. Matching & Recommendations
                ranked = rank_volunteers_for_request(
                    request=ngo_req,
                    extracted_skills=analysis["extracted_skills"],
                    volunteers=volunteers
                )

                for rank_idx, match in enumerate(ranked[:8], start=1):
                    rec = Recommendation(
                        request_id=ngo_req.id,
                        volunteer_id=match["volunteer_id"],
                        match_score=match["match_score"],
                        matched_skills=match["matched_skills"],
                        match_reasons=match["match_reasons"],
                        score_breakdown=match["score_breakdown"],
                        rank=rank_idx,
                        created_at=created_dt
                    )
                    db.add(rec)
                db.commit()

            print(f"Successfully seeded {len(SAMPLE_REQUESTS)} analyzed NGO requests with recommendations.")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
