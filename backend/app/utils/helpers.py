import json
import re
from typing import Any, Dict

def clean_json_string(raw_text: str) -> str:
    """Removes markdown code fences and whitespace from a JSON response."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()

def parse_json_safely(raw_text: str) -> Dict[str, Any]:
    """Attempts to parse JSON from text, extracting the outermost JSON block if needed."""
    cleaned = clean_json_string(raw_text)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Search for first { and last }
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            json_substr = cleaned[start:end+1]
            return json.loads(json_substr)
        raise ValueError(f"Unable to parse valid JSON from text: {raw_text[:200]}...")
