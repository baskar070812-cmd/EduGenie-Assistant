import uvicorn
import os
import sys
from pathlib import Path

# Force UTF-8 on Windows consoles to prevent cp1252 UnicodeEncodeError
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.config import settings

if __name__ == "__main__":
    print(f"[STARTING] Starting EduGenie API on http://{settings.HOST}:{settings.PORT}")
    print(f"[MODEL] Configured Gemini Model: {settings.GEMINI_MODEL}")
    print(f"[KEY] Live Gemini Configured: {settings.is_gemini_configured}")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False
    )
