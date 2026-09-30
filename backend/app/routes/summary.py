from fastapi import APIRouter, HTTPException
from app.models.summary import SummaryRequest, SummaryResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Text Summarizer"])

@router.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: SummaryRequest):
    """Summarize long academic content and extract key takeaways."""
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Source text is too short. Please provide at least 10 characters of educational text."
        )
    return await gemini_service.generate_summary(request)
