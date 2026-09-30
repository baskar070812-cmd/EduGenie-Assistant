from fastapi import APIRouter, HTTPException
from app.models.recommendations import RecommendationsRequest, RecommendationsResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Recommendations"])

@router.post("/recommendations", response_model=RecommendationsResponse)
async def generate_recommendations(request: RecommendationsRequest):
    """Generate personalized recommendations and next study steps."""
    if not request.learning_topic or not request.learning_topic.strip():
        raise HTTPException(status_code=400, detail="Learning topic cannot be empty.")
    return await gemini_service.generate_recommendations(request)
