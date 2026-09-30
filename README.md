# EduGenie – Google Gemini Powered AI Learning Assistant

> **Learn Smarter. Understand Faster.**  
> An intelligent personal educational platform for students to ask academic questions, understand complex concepts, generate custom active-recall quizzes, summarize dense study material, and navigate personalized learning roadmaps.

---

## 📑 Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Key Features](#2-key-features)
- [3. Architecture & Security](#3-architecture--security)
- [4. Technology Stack](#4-technology-stack)
- [5. Project Structure](#5-project-structure)
- [6. Prerequisites](#6-prerequisites)
- [7. Installation & Quickstart](#7-installation--quickstart)
  - [Option A: Unified Server (Fastest)](#option-a-unified-server-fastest)
  - [Option B: Development Mode (Vite HMR + FastAPI)](#option-b-development-mode-vite-hmr--fastapi)
- [8. Environment Variables & Gemini Configuration](#8-environment-variables--gemini-configuration)
- [9. REST API Documentation](#9-rest-api-documentation)
- [10. Testing & Verification](#10-testing--verification)
- [11. Security Model](#11-security-model)
- [12. Future Enhancements](#12-future-enhancements)

---

## 1. Project Overview

EduGenie is designed to eliminate cognitive fatigue for learners. Rather than behaving as a generic chatbot, EduGenie functions as a specialized academic workspace combining:

1. **Step-by-Step AI Tutoring:** Answers questions using analogies, clear structure, and difficulty scaling (Beginner, Intermediate, Advanced).
2. **Smart Active-Recall Quizzes:** Auto-generates multiple choice or true/false questions from topics or custom lecture notes, provides instant scoring, confetti celebration, and question-by-question rationales.
3. **Document-Style Summarizer:** Condenses long papers, textbook chapters, and articles into readable executive summaries, word-count metrics, and key takeaways.
4. **Interactive Learning Roadmaps:** Builds visual week-by-week timelines with objectives, practice drills, and live checkbox progress tracking.
5. **Personalized Recommendations:** Evaluates student goals and completed topics to suggest targeted next steps, skill gap consolidation, and hands-on portfolio projects.

---

## 2. Key Features

| Feature | Description |
| :--- | :--- |
| 🎓 **AI Academic Tutor** | Dedicated study workspace with conversation history, saved questions, follow-up chips, and code/math formatting. |
| 🧠 **Smart Quiz Generator** | Configurable difficulty (Beginner/Intermediate/Advanced), question counts (5/10/15/20), format (MCQ/TF/Mixed), and instant explanations. |
| 📄 **Text Summarizer** | Document-style view with Short, Medium, Detailed, and Bullet Point options, word count metrics, and Markdown export. |
| 🗺️ **Learning Path Roadmap** | Interactive timeline with stage milestones, estimated time, and persistent progress tracking. |
| 🧭 **Strategic Recommendations** | Recommends what to study next, areas to strengthen, advanced stretch concepts, and capstone project ideas. |
| 📊 **Student Dashboard** | Central command center tracking questions asked, quizzes completed, average score, and active learning paths. |
| 🔒 **Strict Backend Security** | Gemini API key is never bundled in frontend JavaScript. All AI calls flow through FastAPI. |

---

## 3. Architecture & Security

```mermaid
flowchart LR
    subgraph Browser ["Student Browser (Frontend)"]
        React["React 19 + TypeScript"]
        Tailwind["Tailwind CSS UI"]
        LocalStorage["Client LocalStorage"]
    end

    subgraph Backend ["FastAPI Application (Port 8000)"]
        Router["FastAPI REST Router"]
        Pydantic["Pydantic v2 Validation"]
        PromptEngine["Pedagogical Prompt Engine"]
        Config["Backend .env (Protected)"]
    end

    subgraph GoogleCloud ["Google Cloud AI"]
        Gemini["Google Gemini 2.5 Flash / Pro"]
    end

    React -->|REST JSON API Requests| Router
    Router --> Pydantic
    Pydantic --> PromptEngine
    Config --> PromptEngine
    PromptEngine -->|Official google-genai SDK (TLS)| Gemini
    Gemini -->|Structured JSON / Content| PromptEngine
    PromptEngine --> Router
    Router -->|JSON Responses| React
    React <--> LocalStorage
```

### Security Rule
- **Never Expose the Gemini Key:** The frontend has zero access to `GEMINI_API_KEY`.
- All requests flow from the frontend to the FastAPI backend, which handles authentication with Google Gemini servers over TLS.

---

## 4. Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Dark SaaS aesthetic, Plus Jakarta Sans typography)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti

### Backend
- **Framework:** Python 3.12 + FastAPI
- **Data Validation:** Pydantic v2
- **Server:** Uvicorn (ASGI)
- **AI SDK:** `google-genai` (Official Google GenAI SDK)
- **Environment Management:** `python-dotenv`
- **Testing:** `httpx` ASGI test client

---

## 5. Project Structure

```
edugenie/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application & SPA static mount
│   │   ├── config.py                   # App configuration & environment loader
│   │   ├── models/                     # Pydantic request/response schemas
│   │   │   ├── chat.py
│   │   │   ├── quiz.py
│   │   │   ├── summary.py
│   │   │   ├── learning_path.py
│   │   │   └── recommendations.py
│   │   ├── prompts/                    # Dedicated pedagogical prompt templates
│   │   │   ├── chat_prompts.py
│   │   │   ├── quiz_prompts.py
│   │   │   ├── summary_prompts.py
│   │   │   ├── learning_path_prompts.py
│   │   │   └── recommendations_prompts.py
│   │   ├── services/
│   │   │   ├── gemini_service.py       # Google GenAI SDK integration & fallback
│   │   │   └── storage_service.py
│   │   ├── routes/                     # REST API endpoint handlers
│   │   │   ├── chat.py
│   │   │   ├── quiz.py
│   │   │   ├── summary.py
│   │   │   ├── learning_path.py
│   │   │   ├── recommendations.py
│   │   │   └── health.py
│   │   └── utils/
│   │       └── helpers.py              # Safe JSON extraction & utilities
│   ├── tests/
│   │   └── verify_all_endpoints.py     # Automated test suite
│   ├── requirements.txt                # Python backend dependencies
│   └── run.py                          # Backend launcher script
├── frontend/
│   ├── src/
│   │   ├── api/                        # Typed API service layer
│   │   │   ├── client.ts
│   │   │   ├── chat.ts
│   │   │   ├── quiz.ts
│   │   │   ├── summarize.ts
│   │   │   ├── learningPath.ts
│   │   │   ├── recommendations.ts
│   │   │   └── status.ts
│   │   ├── components/                 # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── LoadingState.tsx
│   │   │   │   ├── ErrorMessage.tsx
│   │   │   │   └── ConfigModal.tsx
│   │   ├── pages/                      # 8 core application pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── TutorPage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── SummarizerPage.tsx
│   │   │   ├── LearningPathPage.tsx
│   │   │   ├── RecommendationsPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── storage.ts              # LocalStorage persistence
│   │   │   └── demoData.ts             # Realistic sample data
│   │   ├── App.tsx                     # Main layout & router
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .env.example                        # Template environment variables
├── .gitignore
└── README.md
```

---

## 6. Prerequisites

- **Python:** 3.10+ (tested on Python 3.12)
- **Node.js:** 20+ (tested on Node.js v20 LTS)
- **Google Gemini API Key:** Optional for initial demo exploration; required for live generative AI (obtain free from [Google AI Studio](https://aistudio.google.com/)).

---

## 7. Installation & Quickstart

Clone or navigate to the project directory:

```bash
cd edugenie
```

### Setup Environment Variables

Copy the example file to `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and set your key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
HOST=127.0.0.1
PORT=8000
```

---

### Option A: Unified Server (Fastest)

FastAPI automatically serves the pre-compiled React single-page application and all REST API endpoints on a single port!

```bash
# 1. Install backend requirements
pip install -r backend/requirements.txt

# 2. Build the frontend (already built in repository dist/)
cd frontend
npm install
npm run build
cd ..

# 3. Start unified server
python backend/run.py
```

Open your browser to:  
👉 **`http://localhost:8000`**

---

### Option B: Development Mode (Vite HMR + FastAPI)

For active frontend and backend development with instant Hot Module Replacement:

#### Terminal 1 (Backend):
```bash
cd backend
python run.py
```
*FastAPI runs on `http://127.0.0.1:8000` (Interactive docs at `/docs`)*

#### Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```
*Vite runs on `http://localhost:5173` with automatic API proxy to port 8000.*

---

## 8. Environment Variables & Gemini Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | *(empty)* | Your Google Gemini API Key from Google AI Studio. |
| `GEMINI_MODEL` | `gemini-2.5-flash` | The Gemini model name (e.g. `gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-2.5-pro`). |
| `HOST` | `127.0.0.1` | Server binding host. |
| `PORT` | `8000` | Server binding port. |

> **Graceful Demo Fallback:** If you start EduGenie before adding a Gemini key, the application automatically runs in **Curated Demo Mode**. All 5 learning tools remain 100% interactive, and a sleek status indicator in the top navbar alerts you to add your key when ready.

---

## 9. REST API Documentation

FastAPI provides interactive Swagger documentation at **`http://localhost:8000/docs`**.

### Endpoints:

#### 1. AI Tutor Chat
- **URL:** `POST /api/chat`
- **Request:**
  ```json
  {
    "message": "Explain binary search in simple terms.",
    "conversation_history": [],
    "level": "Beginner",
    "topic": "Algorithms"
  }
  ```
- **Response:**
  ```json
  {
    "response": "### Understanding Binary Search...",
    "suggested_followups": [
      "What happens if the array is not sorted?",
      "How does binary search compare to linear search?"
    ],
    "model_used": "Google Gemini (gemini-2.5-flash)"
  }
  ```

#### 2. Quiz Generator
- **URL:** `POST /api/quiz`
- **Request:**
  ```json
  {
    "topic": "Pythagoras Theorem",
    "difficulty": "Intermediate",
    "question_count": 5,
    "question_type": "Multiple Choice",
    "optional_text": ""
  }
  ```
- **Response:**
  ```json
  {
    "title": "Pythagoras Theorem Knowledge Check",
    "topic": "Pythagoras Theorem",
    "difficulty": "Intermediate",
    "questions": [
      {
        "id": 1,
        "question": "In a right triangle with legs 3 and 4, what is the hypotenuse?",
        "options": ["5", "6", "7", "8"],
        "correct_answer": "5",
        "explanation": "3^2 + 4^2 = 9 + 16 = 25, sqrt(25) = 5."
      }
    ],
    "model_used": "Google Gemini (gemini-2.5-flash)"
  }
  ```

#### 3. Text Summarizer
- **URL:** `POST /api/summarize`
- **Request:**
  ```json
  {
    "text": "Your long lecture notes or textbook excerpt...",
    "summary_length": "medium",
    "format": "standard"
  }
  ```
- **Response:**
  ```json
  {
    "summary": "### Core Principles...",
    "key_takeaways": ["Point 1", "Point 2", "Point 3"],
    "original_word_count": 350,
    "summary_word_count": 120,
    "compression_ratio": 65.7,
    "reading_time_minutes": 0.6,
    "model_used": "Google Gemini (gemini-2.5-flash)"
  }
  ```

#### 4. Learning Path Generator
- **URL:** `POST /api/learning-path`
- **Request:**
  ```json
  {
    "topic": "SQL",
    "current_level": "Beginner",
    "study_time": "1 hour/day",
    "duration": "8 weeks"
  }
  ```
- **Response:**
  ```json
  {
    "topic": "SQL",
    "current_level": "Beginner",
    "study_time": "1 hour/day",
    "duration": "8 weeks",
    "total_stages": 8,
    "estimated_total_hours": 45,
    "prerequisites": ["Basic computer literacy"],
    "stages": [
      {
        "stage_number": 1,
        "title": "SQL Fundamentals & Relational Concepts",
        "description": "Understand databases, tables, and basic queries.",
        "topics": ["CREATE TABLE", "SELECT", "WHERE"],
        "learning_objectives": ["Write single-table queries"],
        "recommended_practice": ["Build a 3-table schema"],
        "estimated_time": "5 hours"
      }
    ],
    "model_used": "Google Gemini (gemini-2.5-flash)"
  }
  ```

#### 5. Personalized Recommendations
- **URL:** `POST /api/recommendations`
- **Request:**
  ```json
  {
    "learning_topic": "SQL",
    "current_level": "Intermediate",
    "completed_topics": "SELECT, WHERE, JOINs",
    "goals": "Full-stack engineer"
  }
  ```

#### 6. Health & System Status
- **URL:** `GET /api/health`
- **URL:** `GET /api/status`

---

## 10. Testing & Verification

EduGenie includes an automated test suite verifying all 8 endpoints:

```bash
python backend/tests/verify_all_endpoints.py
```

Expected output:
```
[TEST] Testing all EduGenie API endpoints...
  [PASS] GET /api/health passed
  [PASS] GET /api/status passed
  [PASS] POST /api/chat passed
  [PASS] POST /api/quiz passed
  [PASS] POST /api/summarize passed
  [PASS] POST /api/learning-path passed
  [PASS] POST /api/recommendations passed
  [PASS] GET / passed (Served compiled React SPA directly from FastAPI)

[SUCCESS] ALL 8 BACKEND AND FRONTEND INTEGRATION TESTS PASSED PERFECTLY!
```

---

## 11. Security Model

1. **Server-Side API Key Storage:** `GEMINI_API_KEY` is loaded by Python `dotenv` into server memory. The key never enters Vite bundles or browser network requests.
2. **CORS Restrictions:** Configured to whitelist authorized origins while allowing development flexibility.
3. **Pydantic Validation:** Strict input sanitization prevents injection attacks and validates type boundaries.
4. **Failsafe Exception Handling:** Global exception handlers intercept raw errors, logging them securely on the server without leaking stack traces or internal secrets to client HTTP responses.

---

## 12. Future Enhancements

- **PostgreSQL / SQLAlchemy Database:** Optional persistent user accounts, multi-device synchronization, and class cohort sharing.
- **Multimodal Audio Tutoring:** Voice-to-voice tutoring via Gemini Live Audio APIs.
- **Document / PDF File Upload:** Direct drag-and-drop parsing for research papers and textbook chapters.
- **Export to Anki / Flashcards:** Auto-convert generated quizzes into spaced-repetition Anki decks.

---

## 📄 License & Credits

Built with ❤️ for curious students everywhere. Powered by **Google Gemini** and **FastAPI**.  
© 2026 EduGenie.
