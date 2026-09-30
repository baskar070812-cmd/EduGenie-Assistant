from .chat import router as chat_router
from .quiz import router as quiz_router
from .summary import router as summary_router
from .learning_path import router as learning_path_router
from .recommendations import router as recommendations_router
from .health import router as health_router

__all__ = [
    "chat_router",
    "quiz_router",
    "summary_router",
    "learning_path_router",
    "recommendations_router",
    "health_router",
]
