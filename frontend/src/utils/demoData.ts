import { QuizData, LearningPathData, RecommendationData, SummaryData } from '../types';

export const DEMO_LEARNING_PATH: LearningPathData = {
  topic: "SQL Mastery for Data & Engineering",
  current_level: "Beginner",
  study_time: "1 hour/day",
  duration: "8 weeks",
  total_stages: 8,
  estimated_total_hours: 45,
  prerequisites: ["Basic spreadsheet familiarity", "Understanding of tabular rows and columns"],
  stages: [
    {
      stage_number: 1,
      title: "SQL Fundamentals & Relational Concepts",
      description: "Understand databases, tables, primary keys, and writing your very first queries.",
      topics: ["Relational Model", "CREATE TABLE", "INSERT INTO", "SELECT basics"],
      learning_objectives: ["Set up a local SQLite or PostgreSQL database", "Query specific columns with SELECT"],
      recommended_practice: ["Build a student database with 3 tables", "Write 5 single-table queries"],
      estimated_time: "5 hours",
      completed: true
    },
    {
      stage_number: 2,
      title: "Filtering, Sorting & Pattern Matching",
      description: "Hone precision queries using WHERE conditions, logical operators, and regex/LIKE filters.",
      topics: ["WHERE, AND, OR, NOT", "LIKE & ILIKE wildcards", "ORDER BY & LIMIT", "NULL handling"],
      learning_objectives: ["Filter records dynamically", "Sort results chronologically and alphabetically"],
      recommended_practice: ["Filter customer records with complex compound conditions", "Paginate results using LIMIT/OFFSET"],
      estimated_time: "5 hours",
      completed: true
    },
    {
      stage_number: 3,
      title: "Relational JOINs & Multi-Table Queries",
      description: "The core superpower of SQL: connecting disparate data entities through joins.",
      topics: ["INNER JOIN", "LEFT JOIN vs RIGHT JOIN", "FULL OUTER JOIN", "Self Joins & Aliases"],
      learning_objectives: ["Join 3+ normalized tables without duplicating rows", "Identify orphan records using outer joins"],
      recommended_practice: ["Analyze an e-commerce schema combining Orders, Products, and Users"],
      estimated_time: "6 hours",
      completed: false
    },
    {
      stage_number: 4,
      title: "Aggregations & Grouping Insights",
      description: "Summarize thousands of records into meaningful metrics.",
      topics: ["COUNT, SUM, AVG, MIN, MAX", "GROUP BY semantics", "HAVING vs WHERE", "DISTINCT counts"],
      learning_objectives: ["Calculate department averages and sales totals", "Filter aggregated results with HAVING"],
      recommended_practice: ["Generate monthly revenue reports from raw transaction logs"],
      estimated_time: "6 hours",
      completed: false
    },
    {
      stage_number: 5,
      title: "Subqueries & Common Table Expressions (CTEs)",
      description: "Write clean, modular queries using WITH clauses and nested subqueries.",
      topics: ["Scalar Subqueries", "Correlated Subqueries", "CTEs (WITH clause)", "EXISTS vs IN"],
      learning_objectives: ["Refactor 100-line messy queries into readable CTE pipelines", "Filter by subquery comparisons"],
      recommended_practice: ["Find employees earning above their department's average"],
      estimated_time: "6 hours",
      completed: false
    },
    {
      stage_number: 6,
      title: "Window Functions & Advanced Analytics",
      description: "Perform running totals, rankings, and lead/lag calculations over partitions.",
      topics: ["OVER(PARTITION BY)", "ROW_NUMBER & DENSE_RANK", "LEAD & LAG", "Running Totals"],
      learning_objectives: ["Calculate month-over-month growth rates", "Rank top products per category"],
      recommended_practice: ["Compute moving averages across customer cohorts"],
      estimated_time: "6 hours",
      completed: false
    },
    {
      stage_number: 7,
      title: "Indexes, Query Plans & Performance",
      description: "Understand B-Tree indexes, EXPLAIN ANALYZE, and how to make slow queries fly.",
      topics: ["B-Tree Indexes", "EXPLAIN ANALYZE", "Scan vs Index Seek", "Database Transactions (ACID)"],
      learning_objectives: ["Diagnose sequential table scans on 1M rows", "Create composite indexes to speed up lookups by 100x"],
      recommended_practice: ["Optimize 3 deliberately slow queries in a benchmark dataset"],
      estimated_time: "5 hours",
      completed: false
    },
    {
      stage_number: 8,
      title: "Capstone Project: Production Analytics Pipeline",
      description: "Design an entire schema, seed realistic data, and write an end-to-end analytical reporting suite.",
      topics: ["Schema Architecture", "Database Migrations", "Materialized Views", "Analytical Dashboards"],
      learning_objectives: ["Deliver a production-ready repository with migrations and seed scripts", "Document business metrics"],
      recommended_practice: ["Publish the capstone project on GitHub with query performance benchmarks"],
      estimated_time: "6 hours",
      completed: false
    }
  ],
  model_used: "EduGenie Knowledge Engine"
};

export const DEMO_QUIZ: QuizData = {
  title: "Data Structures & Algorithmic Foundations",
  topic: "Data Structures",
  difficulty: "Intermediate",
  questions: [
    {
      id: 1,
      question: "What is the average time complexity for searching an element in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct_answer: "O(log n)",
      explanation: "In a balanced BST, each comparison halves the remaining search space, yielding logarithmic O(log n) performance."
    },
    {
      id: 2,
      question: "Which data structure follows the First-In, First-Out (FIFO) access policy?",
      options: ["Stack", "Queue", "Heap", "Hash Table"],
      correct_answer: "Queue",
      explanation: "A Queue processes elements in the exact order they arrived (FIFO), commonly used in task scheduling and breadth-first search."
    },
    {
      id: 3,
      question: "What happens when a Hash Table experiences excessive hash collisions without resizing?",
      options: [
        "Lookup time degrades from O(1) towards O(n)",
        "The computer memory overflows immediately",
        "It automatically switches into a red-black tree",
        "Data is permanently corrupted"
      ],
      correct_answer: "Lookup time degrades from O(1) towards O(n)",
      explanation: "When multiple keys hash to the same bucket, chaining or probing causes search times to degrade linearly towards O(n)."
    },
    {
      id: 4,
      question: "True or False: In a Max-Heap, the root node always holds the maximum key present in the entire tree.",
      options: ["True", "False"],
      correct_answer: "True",
      explanation: "By definition, the heap-order property of a Max-Heap guarantees that every parent node is greater than or equal to its children."
    },
    {
      id: 5,
      question: "Which algorithmic paradigm does Binary Search employ?",
      options: ["Dynamic Programming", "Greedy Method", "Divide and Conquer", "Backtracking"],
      correct_answer: "Divide and Conquer",
      explanation: "Binary search divides the problem into subproblems (halves), solves the relevant subproblem, and combines results."
    }
  ],
  model_used: "EduGenie Assessment Engine"
};

export const DEMO_RECOMMENDATIONS: RecommendationData = {
  topic: "SQL & Relational Databases",
  current_level: "Intermediate",
  continue_learning: {
    title: "Mastering Window Functions & CTE Pipelines",
    description: "You have a solid grip on single-table queries and basic joins. Moving to window functions (ROW_NUMBER, LEAD/LAG, PARTITION BY) will enable you to solve complex business analytics questions.",
    why_recommended: "Window functions are the #1 differentiator between junior data query writers and senior data professionals."
  },
  strengthen_knowledge: {
    title: "Practice SQL JOIN Operations & NULL Handling",
    description: "Students frequently confuse LEFT vs INNER JOIN edge cases when NULL values exist in the joined foreign keys, causing unexpected row multiplication.",
    key_focus_areas: ["Outer joins with missing foreign keys", "COALESCE and NULLIF handling", "Multi-table join condition ordering"]
  },
  challenge_yourself: {
    title: "Indexing Strategies & EXPLAIN ANALYZE",
    description: "Dive beneath the declarative syntax into how the database storage engine uses B-Trees and Hash Indexes to fulfill queries on multi-million row datasets.",
    advanced_concepts: ["Composite index column ordering", "Index-only scans vs Sequential scans", "Query planner cost calculation"]
  },
  practice_exercises: [
    "Write a query calculating a 7-day rolling average of daily user signups",
    "Identify customer churn where a user has had no transactions in the last 60 days",
    "Refactor a 4-level nested subquery into two clean Common Table Expressions (CTEs)"
  ],
  project_idea: {
    title: "E-Commerce Financial & Churn Analytics Suite",
    description: "Design a full relational schema modeling Users, Subscriptions, Payments, and Invoices. Write an analytical query suite computing Monthly Recurring Revenue (MRR), cohort retention, and customer lifetime value.",
    deliverables: ["DDL schema with foreign key constraints", "Data generator script for 100k sample rows", "10 production-grade analytical SQL queries"],
    tech_stack: ["PostgreSQL", "Docker", "DBeaver / DataGrip", "FastAPI / Python"]
  },
  disclaimer: "These personalized recommendations are AI-generated suggestions to guide your study routine. Tailor them according to your specific syllabus and schedule.",
  model_used: "EduGenie Knowledge Engine"
};

export const DEMO_SUMMARY: SummaryData = {
  summary: "### Core Principles of Computer Networking & Transport Protocols\n\nComputer networks rely on layered architectures (most notably the TCP/IP and OSI models) to abstract the immense physical complexity of transmitting electrical and optical signals across global distances.\n\nAt the transport layer, **TCP (Transmission Control Protocol)** provides a connection-oriented, guaranteed-delivery service through a three-way handshake (`SYN`, `SYN-ACK`, `ACK`), sequence tracking, flow control, and automatic packet retransmission. In contrast, **UDP (User Datagram Protocol)** provides connectionless, best-effort datagram delivery with near-zero latency overhead, making it the bedrock for real-time applications such as video conferencing, DNS resolution, and online gaming.\n\nModern protocols like **QUIC** (which underpins HTTP/3) merge the low-latency speed of UDP with built-in encryption and transport reliability, illustrating how networking protocols continually evolve to meet higher bandwidth and security demands.",
  key_takeaways: [
    "Layered network architectures isolate concerns between physical transmission and application logic.",
    "TCP guarantees reliable, ordered packet delivery at the cost of slight latency overhead.",
    "UDP prioritizes raw transmission speed and low jitter by omitting connection state.",
    "Modern transport protocols like QUIC combine UDP speed with TCP-grade reliability and TLS encryption."
  ],
  original_word_count: 380,
  summary_word_count: 145,
  compression_ratio: 61.8,
  reading_time_minutes: 0.8,
  model_used: "EduGenie Summarization Engine"
};
