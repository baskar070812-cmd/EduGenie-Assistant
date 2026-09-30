from pydantic import BaseModel, Field
from typing import List

class SummaryRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Educational text, article, or lecture notes to summarize")
    summary_length: str = Field(default="medium", description="short, medium, detailed, bullet_points")
    format: str = Field(default="standard", description="standard, bullet_points, key_takeaways")

class SummaryResponse(BaseModel):
    summary: str = Field(..., description="Cohesive, readable summary text")
    key_takeaways: List[str] = Field(default=[], description="Bullet list of main key takeaways")
    original_word_count: int = Field(..., description="Word count of the input text")
    summary_word_count: int = Field(..., description="Word count of generated summary")
    compression_ratio: float = Field(..., description="Percentage of original size")
    reading_time_minutes: float = Field(..., description="Estimated reading time in minutes")
    model_used: str = Field(..., description="Model used for summarization")
