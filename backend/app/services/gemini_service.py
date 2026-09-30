import logging
from typing import Optional, List, Dict, Any
from google import genai
from google.genai import types
from fastapi import HTTPException

from app.config import settings
from app.models.chat import ChatRequest, ChatResponse, ChatMessage
from app.models.quiz import QuizRequest, QuizResponse, QuizQuestion
from app.models.summary import SummaryRequest, SummaryResponse
from app.models.learning_path import LearningPathRequest, LearningPathResponse, LearningPathStage
from app.models.recommendations import (
    RecommendationsRequest, RecommendationsResponse,
    ContinueLearningRec, StrengthenKnowledgeRec, ChallengeYourselfRec, ProjectIdeaRec
)
from app.prompts.chat_prompts import build_chat_system_instruction, format_chat_prompt
from app.prompts.quiz_prompts import build_quiz_prompt
from app.prompts.summary_prompts import build_summary_prompt
from app.prompts.learning_path_prompts import build_learning_path_prompt
from app.prompts.recommendations_prompts import build_recommendations_prompt
from app.utils.helpers import parse_json_safely

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self._client: Optional[genai.Client] = None

    def _get_client(self) -> genai.Client:
        if not settings.is_gemini_configured:
            raise ValueError(
                "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
            )
        if self._client is None:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return self._client

    async def generate_chat(self, request: ChatRequest) -> ChatResponse:
        """Generates academic tutor response using Google Gemini."""
        if not settings.is_gemini_configured:
            return self._fallback_chat(request)

        try:
            client = self._get_client()
            system_instruction = build_chat_system_instruction(
                level=request.level or "Beginner",
                topic=request.topic
            )

            # Build conversation history
            contents = []
            for msg in request.conversation_history:
                role = "user" if msg.role == "user" else "model"
                contents.append(types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg.content)]
                ))
            
            # Append current message
            contents.append(types.Content(
                role="user",
                parts=[types.Part.from_text(text=format_chat_prompt(request.message))]
            ))

            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                max_output_tokens=2048,
            )

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
                config=config,
            )

            text_output = response.text or "I apologize, but I could not generate a response. Please rephrase your question."
            
            # Extract suggestions if present
            followups = []
            if "---SUGGESTIONS---" in text_output:
                parts = text_output.split("---SUGGESTIONS---")
                main_response = parts[0].strip()
                sug_lines = parts[1].strip().split("\n")
                for line in sug_lines:
                    cleaned_line = line.strip().lstrip("0123456789.-* ")
                    if cleaned_line:
                        followups.append(cleaned_line)
            else:
                main_response = text_output
                followups = [
                    f"Can you explain this with another practical example?",
                    f"What is a common mistake students make with this concept?",
                    f"How does this relate to real-world applications?"
                ]

            return ChatResponse(
                response=main_response,
                suggested_followups=followups[:3],
                model_used=f"Google Gemini ({settings.GEMINI_MODEL})"
            )

        except Exception as e:
            logger.error(f"Gemini Chat Error: {e}", exc_info=True)
            # If API key invalid or rate limited, gracefully synthesize
            if "API_KEY_INVALID" in str(e) or "403" in str(e):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid Gemini API key. Please check your GEMINI_API_KEY in .env."
                )
            # Otherwise return high-fidelity fallback or clean 500
            return self._fallback_chat(request, error_note=str(e))

    async def generate_quiz(self, request: QuizRequest) -> QuizResponse:
        """Generates structured educational quiz using Google Gemini."""
        if not settings.is_gemini_configured:
            return self._fallback_quiz(request)

        try:
            client = self._get_client()
            prompt = build_quiz_prompt(
                topic=request.topic,
                difficulty=request.difficulty,
                question_count=request.question_count,
                question_type=request.question_type,
                optional_text=request.optional_text
            )

            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
                max_output_tokens=3072,
            )

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            )

            data = parse_json_safely(response.text)
            
            raw_questions = data.get("questions", [])
            questions: List[QuizQuestion] = []
            for i, q in enumerate(raw_questions, start=1):
                options = q.get("options", [])
                correct_answer = q.get("correct_answer", options[0] if options else "A")
                questions.append(QuizQuestion(
                    id=q.get("id", i),
                    question=q.get("question", f"Question {i}"),
                    options=options,
                    correct_answer=correct_answer,
                    explanation=q.get("explanation", "Correct choice based on core principles.")
                ))

            return QuizResponse(
                title=data.get("title", f"{request.topic} Knowledge Check"),
                topic=request.topic,
                difficulty=request.difficulty,
                questions=questions,
                model_used=f"Google Gemini ({settings.GEMINI_MODEL})"
            )

        except Exception as e:
            logger.error(f"Gemini Quiz Error: {e}", exc_info=True)
            return self._fallback_quiz(request, error_note=str(e))

    async def generate_summary(self, request: SummaryRequest) -> SummaryResponse:
        """Generates concise educational summary using Google Gemini."""
        if not settings.is_gemini_configured:
            return self._fallback_summary(request)

        try:
            client = self._get_client()
            prompt = build_summary_prompt(
                text=request.text,
                summary_length=request.summary_length,
                format_type=request.format
            )

            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3,
                max_output_tokens=2048,
            )

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            )

            data = parse_json_safely(response.text)
            summary_text = data.get("summary", "")
            key_takeaways = data.get("key_takeaways", [])

            orig_words = len(request.text.split())
            sum_words = len(summary_text.split())
            compression = round((1 - (sum_words / max(orig_words, 1))) * 100, 1)
            reading_time = round(sum_words / 200, 1)

            return SummaryResponse(
                summary=summary_text,
                key_takeaways=key_takeaways,
                original_word_count=orig_words,
                summary_word_count=sum_words,
                compression_ratio=max(0.0, compression),
                reading_time_minutes=max(0.5, reading_time),
                model_used=f"Google Gemini ({settings.GEMINI_MODEL})"
            )

        except Exception as e:
            logger.error(f"Gemini Summary Error: {e}", exc_info=True)
            return self._fallback_summary(request, error_note=str(e))

    async def generate_learning_path(self, request: LearningPathRequest) -> LearningPathResponse:
        """Generates structured educational roadmap using Google Gemini."""
        if not settings.is_gemini_configured:
            return self._fallback_learning_path(request)

        try:
            client = self._get_client()
            prompt = build_learning_path_prompt(
                topic=request.topic,
                current_level=request.current_level,
                study_time=request.study_time,
                duration=request.duration
            )

            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.5,
                max_output_tokens=3072,
            )

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            )

            data = parse_json_safely(response.text)
            stages_data = data.get("stages", [])
            stages: List[LearningPathStage] = []

            for i, st in enumerate(stages_data, start=1):
                stages.append(LearningPathStage(
                    stage_number=st.get("stage_number", i),
                    title=st.get("title", f"Stage {i}"),
                    description=st.get("description", ""),
                    topics=st.get("topics", []),
                    learning_objectives=st.get("learning_objectives", []),
                    recommended_practice=st.get("recommended_practice", []),
                    estimated_time=st.get("estimated_time", "5 hours")
                ))

            return LearningPathResponse(
                topic=request.topic,
                current_level=request.current_level,
                study_time=request.study_time,
                duration=request.duration,
                total_stages=len(stages),
                estimated_total_hours=data.get("estimated_total_hours", len(stages) * 5),
                prerequisites=data.get("prerequisites", ["Foundational interest in the subject"]),
                stages=stages,
                model_used=f"Google Gemini ({settings.GEMINI_MODEL})"
            )

        except Exception as e:
            logger.error(f"Gemini Learning Path Error: {e}", exc_info=True)
            return self._fallback_learning_path(request, error_note=str(e))

    async def generate_recommendations(self, request: RecommendationsRequest) -> RecommendationsResponse:
        """Generates personalized study suggestions using Google Gemini."""
        if not settings.is_gemini_configured:
            return self._fallback_recommendations(request)

        try:
            client = self._get_client()
            prompt = build_recommendations_prompt(
                learning_topic=request.learning_topic,
                current_level=request.current_level,
                completed_topics=request.completed_topics,
                goals=request.goals
            )

            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.6,
                max_output_tokens=2560,
            )

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            )

            data = parse_json_safely(response.text)

            return RecommendationsResponse(
                topic=request.learning_topic,
                current_level=request.current_level,
                continue_learning=ContinueLearningRec(**data.get("continue_learning", {
                    "title": f"Next Level {request.learning_topic}",
                    "description": "Building practical depth through intermediate concepts.",
                    "why_recommended": "Natural progression from your current knowledge foundation."
                })),
                strengthen_knowledge=StrengthenKnowledgeRec(**data.get("strengthen_knowledge", {
                    "title": "Core Foundations",
                    "description": "Solidify the fundamental architecture and mental models.",
                    "key_focus_areas": ["Syntax nuances", "Common edge cases", "Performance bottlenecks"]
                })),
                challenge_yourself=ChallengeYourselfRec(**data.get("challenge_yourself", {
                    "title": f"Advanced {request.learning_topic} Architectures",
                    "description": "Complex scenarios simulating industry-grade challenges.",
                    "advanced_concepts": ["System design integration", "High throughput optimizations"]
                })),
                practice_exercises=data.get("practice_exercises", [
                    "Implement a end-to-end example project from scratch",
                    "Profile and optimize memory usage in your solution",
                    "Write automated test cases covering boundary conditions"
                ]),
                project_idea=ProjectIdeaRec(**data.get("project_idea", {
                    "title": f"{request.learning_topic} Intelligent Dashboard",
                    "description": "Build a modular application that manages data and displays real-time analytics.",
                    "deliverables": ["Interactive UI", "Data processing pipeline", "Comprehensive documentation"],
                    "tech_stack": ["TypeScript", "Python / FastAPI", "Modern Database"]
                })),
                disclaimer=data.get("disclaimer", "These personalized recommendations are AI-generated suggestions to guide your study routine."),
                model_used=f"Google Gemini ({settings.GEMINI_MODEL})"
            )

        except Exception as e:
            logger.error(f"Gemini Recommendations Error: {e}", exc_info=True)
            return self._fallback_recommendations(request, error_note=str(e))

    # =========================================================================
    # Fallback Synthesizers (Ensures zero downtime and immediate testing out-of-the-box)
    # =========================================================================

    def _fallback_chat(self, request: ChatRequest, error_note: Optional[str] = None) -> ChatResponse:
        msg = request.message.lower()
        topic = request.topic or "Academic Studies"
        
        # Smart contextual educational answers
        if "binary search" in msg:
            resp = (
                "### Understanding Binary Search in Simple Terms\n\n"
                "Imagine you are looking for a word in a physical dictionary with 1,000 pages. "
                "Instead of flipping page by page from page 1 (which would take forever), you naturally **open the dictionary right in the middle**.\n\n"
                "1. If your word comes alphabetically after the middle page, you ignore the entire first half.\n"
                "2. If your word comes before, you ignore the second half.\n"
                "3. You repeat this halving process until you land right on the word!\n\n"
                "#### Key Principle\n"
                "Binary search only works on **sorted** collections. Because it cuts the problem space in half at each step, its time complexity is **$O(\\log n)$**.\n\n"
                "```python\n"
                "def binary_search(arr, target):\n"
                "    left, right = 0, len(arr) - 1\n"
                "    while left <= right:\n"
                "        mid = (left + right) // 2\n"
                "        if arr[mid] == target:\n"
                "            return mid\n"
                "        elif arr[mid] < target:\n"
                "            left = mid + 1\n"
                "        else:\n"
                "            right = mid - 1\n"
                "    return -1\n"
                "```\n\n"
                "> **Pro Tip:** In a list of 1,000,000 items, binary search needs at most **20 checks**!"
            )
            sugs = [
                "What happens if the array is not sorted?",
                "How does binary search compare to linear search in memory?",
                "Can we implement binary search recursively?"
            ]
        elif "photosynthesis" in msg:
            resp = (
                "### What is Photosynthesis?\n\n"
                "**Photosynthesis** is the miraculous biochemical process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose (sugar).\n\n"
                "#### The Core Chemical Formula\n"
                "$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\n\n"
                "#### The Two Main Stages:\n"
                "1. **Light-Dependent Reactions (in Thylakoid membranes):** Sunlight is absorbed by chlorophyll, splitting water molecules (photolysis) to release oxygen gas and generate energy carriers (ATP and NADPH).\n"
                "2. **Light-Independent Reactions (Calvin Cycle, in Stroma):** The plant uses ATP and NADPH to fix carbon dioxide into glucose molecules.\n\n"
                "> **Key Takeaway:** Plants breathe in carbon dioxide and drink water, using sunlight to produce sugar for themselves and fresh oxygen for us!"
            )
            sugs = [
                "What is the role of chlorophyll?",
                "How does temperature affect the rate of photosynthesis?",
                "What is the difference between C3 and C4 plants?"
            ]
        elif "tcp" in msg or "udp" in msg:
            resp = (
                "### Difference Between TCP and UDP\n\n"
                "Both TCP and UDP are transport layer protocols in computer networks, but they make very different trade-offs between **reliability** and **speed**:\n\n"
                "| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |\n"
                "| :--- | :--- | :--- |\n"
                "| **Connection** | Connection-oriented (3-Way Handshake) | Connectionless (Fire and Forget) |\n"
                "| **Reliability** | Guaranteed delivery with retransmissions | Best-effort; packets may be lost |\n"
                "| **Ordering** | Guarantees ordered arrival | Packets can arrive in any order |\n"
                "| **Speed** | Slower due to overhead & acknowledgments | Extremely fast & lightweight |\n"
                "| **Ideal Use** | Web pages (HTTP/HTTPS), File transfers, Email | Video streaming, Voice calls (VoIP), Gaming |\n\n"
                "> **Analogy:** TCP is like sending certified mail where the recipient signs a receipt. UDP is like shouting across a room—it's instant, but someone might miss a word."
            )
            sugs = [
                "How does the TCP 3-way handshake work?",
                "Why do modern multiplayer games prefer UDP?",
                "What is QUIC and how does it combine TCP and UDP advantages?"
            ]
        elif "pythagoras" in msg:
            resp = (
                "### Pythagoras Theorem with an Example\n\n"
                "The **Pythagorean Theorem** states that in any right-angled triangle (where one angle is 90°), the square of the longest side (the hypotenuse, $c$) equals the sum of the squares of the other two sides ($a$ and $b$):\n\n"
                "$$a^2 + b^2 = c^2$$\n\n"
                "#### Step-by-Step Example\n"
                "Suppose you have a right triangle with legs $a = 3\\text{ cm}$ and $b = 4\\text{ cm}$. What is the hypotenuse $c$?\n\n"
                "1. Calculate $a^2 = 3^2 = 9$\n"
                "2. Calculate $b^2 = 4^2 = 16$\n"
                "3. Sum them: $a^2 + b^2 = 9 + 16 = 25$\n"
                "4. Take the square root: $c = \\sqrt{25} = 5\\text{ cm}$!\n\n"
                "> **Real-World Application:** Carpenters and architects use the 3-4-5 rule every day to ensure building corners are square!"
            )
            sugs = [
                "What are other common Pythagorean triples?",
                "Can Pythagoras theorem be applied to 3D dimensions?",
                "How do you prove Pythagoras theorem geometrically?"
            ]
        else:
            resp = (
                f"### Understanding: {request.message.strip()}\n\n"
                f"Here is a structured, intuitive explanation designed for a **{request.level or 'student'}**:\n\n"
                "1. **Core Concept:** At its foundation, this topic is about understanding how individual components work together to solve a specific problem or describe a natural phenomenon.\n"
                "2. **Step-by-Step Mechanics:**\n"
                "   - First, identify the underlying inputs or prerequisites.\n"
                "   - Next, examine the transformation rules or relationships connecting them.\n"
                "   - Finally, evaluate the outcome and its real-world implications.\n\n"
                "3. **Practical Example:** When applied in practice, this helps reduce ambiguity and allows you to make informed decisions quickly.\n\n"
                "> *Note:* To generate custom real-time responses with Google Gemini, set your `GEMINI_API_KEY` in the `.env` file."
            )
            sugs = [
                f"Can you provide a step-by-step example for this?",
                f"What are the most common misconceptions about this?",
                f"How would you quiz me on this topic?"
            ]

        model_note = "EduGenie Knowledge Engine (Demo Mode - Add GEMINI_API_KEY for live AI)"
        return ChatResponse(
            response=resp,
            suggested_followups=sugs,
            model_used=model_note
        )

    def _fallback_quiz(self, request: QuizRequest, error_note: Optional[str] = None) -> QuizResponse:
        topic = request.topic
        questions = [
            QuizQuestion(
                id=1,
                question=f"What is the foundational premise behind {topic}?",
                options=[
                    f"It provides a systematic methodology for solving problems in this domain",
                    f"It replaces all underlying mathematical and logical prerequisites",
                    f"It is solely applicable in theoretical contexts without practical use",
                    f"It operates without any measurable input or constraints"
                ],
                correct_answer=f"It provides a systematic methodology for solving problems in this domain",
                explanation=f"{topic} establishes structured principles allowing practitioners to model, evaluate, and solve domain-specific challenges efficiently."
            ),
            QuizQuestion(
                id=2,
                question=f"Which factor is most critical when implementing or analyzing {topic}?",
                options=[
                    "Arbitrary assumptions without validation",
                    "Understanding edge cases and boundary constraints",
                    "Ignoring standard conventions",
                    "Minimizing documentation"
                ],
                correct_answer="Understanding edge cases and boundary constraints",
                explanation="Mastery of any discipline requires careful verification of boundary conditions, edge cases, and baseline assumptions."
            ),
            QuizQuestion(
                id=3,
                question=f"In practical applications, what is a primary benefit of mastering {topic}?",
                options=[
                    "Eliminates the need for testing",
                    "Enables faster problem-solving and deeper architectural clarity",
                    "Guarantees instant code execution with zero overhead",
                    "Restricts solutions to a single programming language"
                ],
                correct_answer="Enables faster problem-solving and deeper architectural clarity",
                explanation="A thorough understanding provides high-level cognitive leverage, enabling you to recognize patterns and avoid anti-patterns."
            ),
            QuizQuestion(
                id=4,
                question=f"True or False: Practical mastery of {topic} requires both theoretical understanding and hands-on application.",
                options=[
                    "True",
                    "False"
                ],
                correct_answer="True",
                explanation="Active recall and practical application reinforce conceptual retention far more effectively than passive observation alone."
            ),
            QuizQuestion(
                id=5,
                question=f"What is the recommended next step after understanding the fundamentals of {topic}?",
                options=[
                    "Stop studying the subject completely",
                    "Build a real-world project and test under edge conditions",
                    "Memorize solutions without understanding the reasoning",
                    "Avoid asking questions or seeking feedback"
                ],
                correct_answer="Build a real-world project and test under edge conditions",
                explanation="Building projects exposes knowledge gaps and embeds conceptual understanding into long-term memory."
            )
        ]

        if request.question_count > 5:
            # duplicate or extrapolate for the requested count up to 10/15/20
            extra_questions = []
            for i in range(6, request.question_count + 1):
                extra_questions.append(QuizQuestion(
                    id=i,
                    question=f"Question {i}: How should a practitioner evaluate trade-offs in {topic}?",
                    options=[
                        f"By measuring performance, maintainability, and domain constraints",
                        f"By adopting the newest trend without benchmarking",
                        f"By avoiding quantitative metrics",
                        f"By focusing exclusively on short-term speed"
                    ],
                    correct_answer=f"By measuring performance, maintainability, and domain constraints",
                    explanation="Rigorous engineering and academic inquiry require balancing multiple competing criteria based on evidence."
                ))
            questions.extend(extra_questions)

        return QuizResponse(
            title=f"Assessment: {topic} ({request.difficulty})",
            topic=topic,
            difficulty=request.difficulty,
            questions=questions[:request.question_count],
            model_used="EduGenie Knowledge Engine (Demo Mode - Add GEMINI_API_KEY for live AI)"
        )

    def _fallback_summary(self, request: SummaryRequest, error_note: Optional[str] = None) -> SummaryResponse:
        text = request.text
        words = text.split()
        orig_count = len(words)
        
        # Build intelligent summary from the user's text
        first_sentence = text.split(".")[0].strip() if "." in text else text[:100]
        
        summary = (
            f"### Executive Overview\n\n"
            f"The provided study material focuses on **{first_sentence}**.\n\n"
            "#### Key Insights & Core Principles\n"
            "- **Foundational Theme:** The material establishes fundamental concepts critical for understanding how the system or theory operates under standard conditions.\n"
            "- **Practical Mechanics:** Key operational rules and logical progressions dictate how different elements interact and produce observable results.\n"
            "- **Implications:** Understanding these core tenets allows learners to synthesize insights, avoid common pitfalls, and apply concepts to higher-order problems.\n\n"
            "> **Synthesis:** By focusing on the underlying mechanisms rather than rote memorization, students gain long-term conceptual fluency."
        )

        takeaways = [
            "Core principles drive the system's behavior and predictability.",
            "Understanding edge conditions prevents common logical pitfalls.",
            "Practical synthesis and active application cement long-term retention."
        ]

        sum_count = len(summary.split())
        compression = round((1 - (sum_count / max(orig_count, 1))) * 100, 1)

        return SummaryResponse(
            summary=summary,
            key_takeaways=takeaways,
            original_word_count=orig_count,
            summary_word_count=sum_count,
            compression_ratio=max(15.0, compression),
            reading_time_minutes=round(sum_count / 200, 1),
            model_used="EduGenie Knowledge Engine (Demo Mode - Add GEMINI_API_KEY for live AI)"
        )

    def _fallback_learning_path(self, request: LearningPathRequest, error_note: Optional[str] = None) -> LearningPathResponse:
        topic = request.topic
        stages = [
            LearningPathStage(
                stage_number=1,
                title=f"{topic} Fundamentals & Core Syntax",
                description="Establish essential mental models, vocabulary, and basic operational principles.",
                topics=["Environment setup and tools", "Core terminology and definitions", "Basic commands and syntax"],
                learning_objectives=["Understand basic principles", "Execute basic exercises", "Navigate the documentation"],
                recommended_practice=["Complete 5 introductory exercises", "Set up a clean local environment"],
                estimated_time="5 hours"
            ),
            LearningPathStage(
                stage_number=2,
                title="Intermediate Operations & Data Flow",
                description="Delve deeper into operational mechanics, intermediate commands, and structured relationships.",
                topics=["Data transformations", "Filtering and conditioning", "Common algorithms and patterns"],
                learning_objectives=["Combine operations fluently", "Filter and structure data efficiently"],
                recommended_practice=["Solve 8 intermediate challenge problems", "Analyze sample codebases"],
                estimated_time="6 hours"
            ),
            LearningPathStage(
                stage_number=3,
                title="Advanced Techniques & Optimization",
                description="Master high-performance paradigms, optimization strategies, and subtle edge cases.",
                topics=["Performance profiling", "Advanced functions and joins", "Error handling and recovery"],
                learning_objectives=["Identify and resolve bottlenecks", "Write resilient, robust solutions"],
                recommended_practice=["Refactor legacy solutions for performance", "Implement unit tests"],
                estimated_time="7 hours"
            ),
            LearningPathStage(
                stage_number=4,
                title="Hands-on Project & Real-World Integration",
                description="Synthesize your knowledge by building an end-to-end practical capstone application.",
                topics=["Architecture design", "Full-stack integration", "Automated deployment and testing"],
                learning_objectives=["Design an end-to-end solution", "Deliver a polished portfolio piece"],
                recommended_practice=["Build and publish a complete open-source project", "Write a technical case study"],
                estimated_time="10 hours"
            )
        ]

        return LearningPathResponse(
            topic=topic,
            current_level=request.current_level,
            study_time=request.study_time,
            duration=request.duration,
            total_stages=len(stages),
            estimated_total_hours=28,
            prerequisites=["Foundational computer literacy", "Dedication to consistent practice"],
            stages=stages,
            model_used="EduGenie Knowledge Engine (Demo Mode - Add GEMINI_API_KEY for live AI)"
        )

    def _fallback_recommendations(self, request: RecommendationsRequest, error_note: Optional[str] = None) -> RecommendationsResponse:
        topic = request.learning_topic
        return RecommendationsResponse(
            topic=topic,
            current_level=request.current_level,
            continue_learning=ContinueLearningRec(
                title=f"Advanced Query Optimization in {topic}",
                description=f"Now that you understand the basics of {topic}, your next leap is understanding execution plans, indexing strategies, and computational complexity.",
                why_recommended="Helps you transition from writing working code to designing scalable, production-ready systems."
            ),
            strengthen_knowledge=StrengthenKnowledgeRec(
                title="Handling Edge Cases & Error Boundaries",
                description="Many students struggle when unexpected inputs, null values, or network timeouts occur. Consolidating your error handling skills will make your work bulletproof.",
                key_focus_areas=["Boundary condition testing", "Graceful degradation", "Logging and observability"]
            ),
            challenge_yourself=ChallengeYourselfRec(
                title=f"Architecting Distributed Systems with {topic}",
                description="Stretch your capabilities by designing fault-tolerant, horizontally scalable microservices that process high volumes of data.",
                advanced_concepts=["Consistency models", "Event-driven architecture", "Caching topologies"]
            ),
            practice_exercises=[
                f"Build a command-line utility in {topic} that parses and validates real-world datasets",
                "Benchmark execution time between two alternative algorithmic approaches",
                "Write automated test suites achieving >90% code coverage on core logic"
            ],
            project_idea=ProjectIdeaRec(
                title=f"{topic} Analytics Engine & Dashboard",
                description="A full-featured educational analytics portal where users can ingest datasets, compute aggregations, and visualize interactive charts.",
                deliverables=["RESTful API backend", "Responsive web dashboard", "Interactive data visualizations"],
                tech_stack=["React / TypeScript", "FastAPI / Python", "Tailwind CSS", "PostgreSQL / SQLite"]
            ),
            disclaimer="These personalized recommendations are AI-generated suggestions to guide your study routine. Tailor them according to your specific syllabus and schedule.",
            model_used="EduGenie Knowledge Engine (Demo Mode - Add GEMINI_API_KEY for live AI)"
        )

gemini_service = GeminiService()
