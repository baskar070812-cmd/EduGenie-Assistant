from pydantic import BaseModel, Field
from typing import Optional, List

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'/'model'")
    content: str = Field(..., description="The message content")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Student's academic question or prompt")
    conversation_history: List[ChatMessage] = Field(default=[], description="Previous conversation context")
    topic: Optional[str] = Field(default=None, description="Optional academic topic or subject")
    level: Optional[str] = Field(default="Beginner", description="Student's level: Beginner, Intermediate, Advanced")

class ChatResponse(BaseModel):
    response: str = Field(..., description="EduGenie's explanation and answer")
    suggested_followups: List[str] = Field(default=[], description="Suggested follow-up questions for deeper learning")
    model_used: str = Field(..., description="Gemini model or engine that processed the request")
