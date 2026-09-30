def build_quiz_prompt(
    topic: str,
    difficulty: str,
    question_count: int,
    question_type: str,
    optional_text: str | None = None
) -> str:
    source_context = ""
    if optional_text and optional_text.strip():
        source_context = f"\nStudy Material to base questions on:\n\"\"\"\n{optional_text.strip()}\n\"\"\"\n"

    return f"""You are EduGenie's Assessment Engine. Generate a comprehensive educational quiz.

Target Topic: {topic}
Difficulty Level: {difficulty}
Number of Questions: {question_count}
Question Format: {question_type}
{source_context}

Requirements:
1. Generate exactly {question_count} high-quality questions designed to test conceptual understanding and application.
2. For "Multiple Choice", provide exactly 4 distinct choices (A, B, C, D).
3. For "True/False", provide 2 choices ("True", "False").
4. For "Mixed", alternate between Multiple Choice and True/False questions.
5. Provide a clear, educational explanation for why the correct answer is right and why distractors are wrong.
6. The `correct_answer` field MUST match one of the string elements in `options` character-for-character.
7. Return ONLY valid JSON adhering strictly to the schema below without markdown backticks or extra commentary.

Schema:
{{
  "title": "string (e.g. Master Pythagoras Theorem: Intermediate Quiz)",
  "topic": "{topic}",
  "difficulty": "{difficulty}",
  "questions": [
    {{
      "id": 1,
      "question": "Clear question text?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct_answer": "Option A text",
      "explanation": "Clear explanation of why this answer is correct."
    }}
  ]
}}
"""
