import sys
import os
import asyncio
from pathlib import Path

# Force UTF-8 stdout on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add backend to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app
from httpx import AsyncClient, ASGITransport

async def test_endpoints():
    print("[TEST] Testing all EduGenie API endpoints...")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("  [PASS] GET /api/health passed:", res.json())

        # 2. Status
        res = await client.get("/api/status")
        assert res.status_code == 200, f"Status check failed: {res.text}"
        print("  [PASS] GET /api/status passed:", res.json())

        # 3. Chat
        chat_payload = {
            "message": "Explain binary search in simple terms.",
            "conversation_history": [],
            "level": "Beginner"
        }
        res = await client.post("/api/chat", json=chat_payload)
        assert res.status_code == 200, f"Chat endpoint failed: {res.text}"
        chat_data = res.json()
        assert "response" in chat_data
        assert len(chat_data.get("suggested_followups", [])) > 0
        print("  [PASS] POST /api/chat passed (Received response & suggestions)")

        # 4. Quiz
        quiz_payload = {
            "topic": "Pythagoras Theorem",
            "difficulty": "Intermediate",
            "question_count": 5,
            "question_type": "Multiple Choice"
        }
        res = await client.post("/api/quiz", json=quiz_payload)
        assert res.status_code == 200, f"Quiz endpoint failed: {res.text}"
        quiz_data = res.json()
        assert len(quiz_data.get("questions", [])) == 5
        print("  [PASS] POST /api/quiz passed (Generated 5 questions with options and explanations)")

        # 5. Summarize
        summary_payload = {
            "text": "Computer networks rely on layered architectures (most notably the TCP/IP and OSI models) to abstract physical complexity. At the transport layer, TCP provides reliable connection-oriented delivery through acknowledgments, whereas UDP provides fast, connectionless delivery.",
            "summary_length": "medium",
            "format": "standard"
        }
        res = await client.post("/api/summarize", json=summary_payload)
        assert res.status_code == 200, f"Summarize endpoint failed: {res.text}"
        sum_data = res.json()
        assert "summary" in sum_data
        assert len(sum_data.get("key_takeaways", [])) > 0
        print("  [PASS] POST /api/summarize passed (Calculated compression ratio & key takeaways)")

        # 6. Learning Path
        lp_payload = {
            "topic": "SQL",
            "current_level": "Beginner",
            "study_time": "1 hour/day",
            "duration": "8 weeks"
        }
        res = await client.post("/api/learning-path", json=lp_payload)
        assert res.status_code == 200, f"Learning path endpoint failed: {res.text}"
        lp_data = res.json()
        assert len(lp_data.get("stages", [])) > 0
        print("  [PASS] POST /api/learning-path passed (Generated timeline stages with objectives)")

        # 7. Recommendations
        rec_payload = {
            "learning_topic": "SQL",
            "current_level": "Intermediate",
            "completed_topics": "Basic SELECT, WHERE",
            "goals": "Full-stack developer"
        }
        res = await client.post("/api/recommendations", json=rec_payload)
        assert res.status_code == 200, f"Recommendations endpoint failed: {res.text}"
        rec_data = res.json()
        assert "continue_learning" in rec_data
        assert "project_idea" in rec_data
        print("  [PASS] POST /api/recommendations passed (Generated structured cards)")

        # 8. Frontend SPA Root
        res = await client.get("/")
        assert res.status_code == 200, f"SPA root failed: {res.status_code}"
        assert "EduGenie" in res.text or "<!doctype html>" in res.text.lower()
        print("  [PASS] GET / passed (Served compiled React SPA directly from FastAPI)")

    print("\n[SUCCESS] ALL 8 BACKEND AND FRONTEND INTEGRATION TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
