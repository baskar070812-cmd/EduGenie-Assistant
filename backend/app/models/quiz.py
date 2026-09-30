from pydantic import BaseModel, Field
from typing import List, Optional

class QuizQuestion(BaseModel):
    id: int = Field(..., description="1-indexed question number")
    question: str = Field(..., description="The quiz question text")
    options: List[str] = Field(..., description="Possible answer choices (e.g. A, B, C, D)")
    correct_answer: str = Field(..., description="Exact match with one of the options or option prefix")
    explanation: str = Field(..., description="Clear explanation of why this answer is correct")

class QuizRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="Quiz topic, e.g. Pythagoras Theorem")
    difficulty: str = Field(default="Intermediate", description="Beginner, Intermediate, Advanced")
    question_count: int = Field(default=5, ge=1, le=20, description="Number of questions (5, 10, 15, 20)")
    question_type: str = Field(default="Multiple Choice", description="Multiple Choice, True/False, Mixed")
    optional_text: Optional[str] = Field(default=None, description="Optional study material or notes to base the quiz on")

class QuizResponse(BaseModel):
    title: str = Field(..., description="Engaging title for the quiz")
    topic: str = Field(..., description="The topic covered")
    difficulty: str = Field(..., description="Difficulty level")
    questions: List[QuizQuestion] = Field(..., description="List of generated questions")
    model_used: str = Field(..., description="Model used for generation")
