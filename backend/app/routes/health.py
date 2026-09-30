from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/api", tags=["System & Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

@router.get("/status")
async def system_status():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_configured": settings.is_gemini_configured,
        "mode": "live_gemini" if settings.is_gemini_configured else "curated_demo"
    }
