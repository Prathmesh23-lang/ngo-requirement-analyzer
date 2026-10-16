from app.routes.requests import router as requests_router
from app.routes.volunteers import router as volunteers_router
from app.routes.recommendations import router as recommendations_router
from app.routes.dashboard import router as dashboard_router

__all__ = [
    "requests_router",
    "volunteers_router",
    "recommendations_router",
    "dashboard_router",
]
