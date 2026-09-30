from pydantic import BaseModel, Field
from typing import List

class ContinueLearningRec(BaseModel):
    title: str = Field(..., description="Recommended next topic")
    description: str = Field(..., description="Detailed explanation of the topic")
    why_recommended: str = Field(..., description="Why this naturally follows current progress")

class StrengthenKnowledgeRec(BaseModel):
    title: str = Field(..., description="Concept to consolidate or review")
    description: str = Field(..., description="Why it requires more practice")
    key_focus_areas: List[str] = Field(..., description="Bullet items to focus on")

class ChallengeYourselfRec(BaseModel):
    title: str = Field(..., description="Advanced challenge or stretch topic")
    description: str = Field(..., description="Why it will elevate the student's mastery")
    advanced_concepts: List[str] = Field(..., description="Advanced concepts introduced")

class ProjectIdeaRec(BaseModel):
    title: str = Field(..., description="Practical portfolio/capstone project title")
    description: str = Field(..., description="Project scenario and objectives")
    deliverables: List[str] = Field(..., description="List of tangible milestones")
    tech_stack: List[str] = Field(..., description="Suggested tools and libraries")

class RecommendationsRequest(BaseModel):
    learning_topic: str = Field(..., min_length=1, description="What the student is currently learning")
    current_level: str = Field(default="Intermediate", description="Beginner, Intermediate, Advanced")
    completed_topics: str = Field(default="", description="Topics already completed")
    goals: str = Field(default="", description="Student's career or academic goals")

class RecommendationsResponse(BaseModel):
    topic: str = Field(..., description="Current topic")
    current_level: str = Field(..., description="Current level")
    continue_learning: ContinueLearningRec
    strengthen_knowledge: StrengthenKnowledgeRec
    challenge_yourself: ChallengeYourselfRec
    practice_exercises: List[str] = Field(..., description="Hands-on practice exercises")
    project_idea: ProjectIdeaRec
    disclaimer: str = Field(
        default="These personalized recommendations are AI-generated suggestions to guide your study routine. Tailor them according to your specific syllabus and schedule.",
        description="Clear AI disclaimer"
    )
    model_used: str = Field(..., description="Model used")
