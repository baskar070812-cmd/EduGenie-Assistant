def build_summary_prompt(
    text: str,
    summary_length: str = "medium",
    format_type: str = "standard"
) -> str:
    length_guidelines = {
        "short": "Provide a very punchy executive summary (around 1-2 concise paragraphs, 80-120 words).",
        "medium": "Provide a well-balanced summary capturing core concepts and nuance (3-4 paragraphs, 150-250 words).",
        "detailed": "Provide an in-depth comprehensive breakdown covering all key principles, nuances, and conclusions (300-500 words).",
        "bullet_points": "Format the summary predominantly as crisp, organized bullet points with bold subheadings."
    }.get(summary_length, "Provide a balanced, readable educational summary.")

    return f"""You are EduGenie's Content Summarization Engine.
Your task is to summarize the provided educational material with extreme clarity and fidelity.

Instructions:
1. Preserve all essential facts, core principles, technical definitions, and takeaways.
2. Remove fluff, conversational filler, and unnecessary repetition.
3. Use simple, direct, accessible language that helps a student grasp the material rapidly.
4. DO NOT invent, extrapolate, or hallucinate information not present in or directly substantiated by the source text.
5. Length instruction: {length_guidelines}
6. Extract 3 to 6 high-impact key takeaways.

Source Text:
\"\"\"
{text}
\"\"\"

Return ONLY a valid JSON object matching this schema:
{{
  "summary": "Formatted markdown text of the summary...",
  "key_takeaways": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ]
}}
"""
