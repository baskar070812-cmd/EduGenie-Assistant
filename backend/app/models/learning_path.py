from pydantic import BaseModel, Field
from typing import List

class LearningPathStage(BaseModel):
    stage_number: int = Field(..., description="Stage / week / module number")
    title: str = Field(..., description="Stage title, e.g. SQL Fundamentals")
    description: str = Field(..., description="Overview of what is achieved in this stage")
    topics: List[str] = Field(..., description="Specific topics covered")
    learning_objectives: List[str] = Field(..., description="What the student will be able to do")
    recommended_practice: List[str] = Field(..., description="Suggested exercises and practice tasks")
    estimated_time: str = Field(..., description="Estimated time for this stage, e.g. '5-6 hours'")

class LearningPathRequest(BaseModel):
    topic: str = Field(..., min_length=1, description="Topic or subject the student wants to learn (e.g. SQL, Data Science)")
    current_level: str = Field(default="Beginner", description="Beginner, Intermediate, Advanced")
    study_time: str = Field(default="1 hour/day", description="30 minutes/day, 1 hour/day, 2 hours/day, Custom")
    duration: str = Field(default="8 weeks", description="Target timeframe, e.g. 4 weeks, 8 weeks, 12 weeks")

class LearningPathResponse(BaseModel):
    topic: str = Field(..., description="Topic")
    current_level: str = Field(..., description="Current level")
    study_time: str = Field(..., description="Daily study commitment")
    duration: str = Field(..., description="Overall duration")
    total_stages: int = Field(..., description="Number of roadmap stages")
    estimated_total_hours: int = Field(..., description="Total estimated hours")
    prerequisites: List[str] = Field(default=[], description="Recommended prerequisites before starting")
    stages: List[LearningPathStage] = Field(..., description="Ordered list of learning stages")
    model_used: str = Field(..., description="Model used")
