from fastapi import APIRouter, HTTPException
from app.models.learning_path import LearningPathRequest, LearningPathResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Learning Path"])

@router.post("/learning-path", response_model=LearningPathResponse)
async def generate_learning_path(request: LearningPathRequest):
    """Generate structured educational roadmap with stages and milestones."""
    if not request.topic or not request.topic.strip():
        raise HTTPException(status_code=400, detail="Learning topic cannot be empty.")
    return await gemini_service.generate_learning_path(request)
