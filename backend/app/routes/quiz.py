from fastapi import APIRouter, HTTPException
from app.models.quiz import QuizRequest, QuizResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Quiz Generator"])

@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generate structured educational quiz from topic or study text."""
    if not request.topic or not request.topic.strip():
        raise HTTPException(status_code=400, detail="Quiz topic cannot be empty.")
    return await gemini_service.generate_quiz(request)
