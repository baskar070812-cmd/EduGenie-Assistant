def build_recommendations_prompt(
    learning_topic: str,
    current_level: str,
    completed_topics: str,
    goals: str
) -> str:
    completed_context = f"Topics already completed: {completed_topics}." if completed_topics else "Has recently begun studying."
    goals_context = f"Student's overarching goals: {goals}." if goals else "Wants to gain practical and conceptual mastery."

    return f"""You are EduGenie's Personal Learning Advisor.
Analyze the student's current profile and generate targeted, actionable recommendations.

Student Profile:
- Learning Topic: {learning_topic}
- Current Level: {current_level}
- {completed_context}
- {goals_context}

Required Output Categories:
1. Continue Learning: The single most impactful logical next topic to tackle.
2. Strengthen Your Knowledge: A fundamental or tricky area in this domain that students commonly stumble on, needing reinforcement.
3. Challenge Yourself: An advanced or cutting-edge concept that will stretch their capabilities.
4. Practice Exercises: 3-4 specific hands-on exercises to build muscle memory.
5. Project Idea: A tangible, portfolio-worthy project applying these concepts, with deliverables and recommended tech stack.

Return ONLY a valid JSON object matching this schema:
{{
  "topic": "{learning_topic}",
  "current_level": "{current_level}",
  "continue_learning": {{
    "title": "Topic name",
    "description": "Comprehensive explanation of what to learn next",
    "why_recommended": "Pedagogical justification based on their progress"
  }},
  "strengthen_knowledge": {{
    "title": "Core concept to consolidate",
    "description": "Why students struggle here and how to master it",
    "key_focus_areas": ["Area 1", "Area 2", "Area 3"]
  }},
  "challenge_yourself": {{
    "title": "Advanced stretch topic",
    "description": "How this concept bridges beginner understanding with professional mastery",
    "advanced_concepts": ["Concept 1", "Concept 2"]
  }},
  "practice_exercises": [
    "Exercise 1 description",
    "Exercise 2 description",
    "Exercise 3 description"
  ],
  "project_idea": {{
    "title": "Practical project title",
    "description": "Real-world scenario and functionality",
    "deliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
    "tech_stack": ["Tool 1", "Tool 2", "Tool 3"]
  }},
  "disclaimer": "These personalized recommendations are AI-generated suggestions to guide your study routine. Tailor them according to your specific syllabus and schedule."
}}
"""
