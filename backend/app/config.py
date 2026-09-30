import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from edugenie root or backend directory
backend_dir = Path(__file__).resolve().parent.parent
root_dir = backend_dir.parent

load_dotenv(root_dir / ".env")
load_dotenv(backend_dir / ".env")

class Settings:
    PROJECT_NAME: str = "EduGenie API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Google Gemini Powered AI Learning Assistant Backend"
    
    # Gemini configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
    
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS Configuration
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]
    
    @property
    def is_gemini_configured(self) -> bool:
        return bool(self.GEMINI_API_KEY and not self.GEMINI_API_KEY.startswith("your_"))

settings = Settings()
