from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.seed.seed_data import seed_database
from app.routes.requests import router as requests_router
from app.routes.volunteers import router as volunteers_router
from app.routes.recommendations import router as recommendations_router
from app.routes.dashboard import router as dashboard_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    # Seed database if not populated
    await seed_database()
    yield

app = FastAPI(
    title="NGO Requirement Analyzer API",
    description="Intelligent NLP & AI-powered volunteer matching engine for NGOs",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = ["*"] if "*" in settings.cors_origins_list else settings.cors_origins_list
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(requests_router)
app.include_router(volunteers_router)
app.include_router(recommendations_router)
app.include_router(dashboard_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "env": settings.APP_ENV,
        "ai_status": "Active (Hybrid NLP & Rule Engine + LLM fallback)"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the NGO Requirement Analyzer API. Visit /docs for OpenAPI documentation."
    }
