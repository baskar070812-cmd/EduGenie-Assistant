from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["AI Tutor"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(request: ChatRequest):
    """Ask academic questions to EduGenie AI Tutor."""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Question message cannot be empty.")
    return await gemini_service.generate_chat(request)
