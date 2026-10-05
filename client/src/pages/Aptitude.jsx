import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Aptitude() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [jobRole, setJobRole] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);

    const [answered, setAnswered] = useState(false);
    const [finished, setFinished] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [questionSource, setQuestionSource] = useState("");

    const [isCorrect, setIsCorrect] = useState(false);

    // ============================================================
    // GET LATEST JOB
    // ============================================================

    useEffect(() => {
        const fetchLatestJob = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login again.");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to load job information"
                    );
                }

                if (
                    data.analyses &&
                    data.analyses.length > 0
                ) {
                    const latestJob = data.analyses[0];

                    setJobRole(
                        latestJob.job_title ||
                            "Software Engineer"
                    );
                } else {
                    setJobRole("Software Engineer");
                }
            } catch (error) {
                console.error(error);
                setJobRole("Software Engineer");
            }
        };

        fetchLatestJob();
    }, []);

    // ============================================================
    // RESET QUIZ
    // ============================================================

    const resetQuiz = () => {
        setQuestions([]);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setAnswered(false);
        setFinished(false);
        setIsCorrect(false);
    };

    // ============================================================
    // LOAD QUESTIONS FROM DATABASE
    // ============================================================

    const loadDatabaseQuestions = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again.");
            }

            const response = await fetch(
                "http://localhost:5000/api/interview/questions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        category: "Aptitude",
                        difficulty: difficulty,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load question bank."
                );
            }

            if (
                !data.questions ||
                data.questions.length === 0
            ) {
                throw new Error(
                    "No aptitude questions found in the question bank."
                );
            }

            const formattedQuestions =
                data.questions.map((item) => {
                    let options = item.options;

                    if (!Array.isArray(options)) {
                        if (
                            options &&
                            typeof options === "object"
                        ) {
                            options = Object.values(options);
                        } else {
                            options = [];
                        }
                    }

                    return {
                        question:
                            item.question || "",

                        options: options,

                        answer:
                            item.correct_answer || "",

                        explanation:
                            item.explanation ||
                            "No explanation available.",

                        topic:
                            item.subcategory ||
                            "Aptitude",

                        difficulty:
                            item.difficulty ||
                            difficulty,
                    };
                });

            setQuestions(formattedQuestions);
            setQuestionSource("Question Bank");

            setCurrentQuestion(0);
            setSelectedAnswer("");
            setScore(0);
            setAnswered(false);
            setFinished(false);
            setIsCorrect(false);

            setError("");

            return true;
        } catch (error) {
            console.error(
                "Database question error:",
                error
            );

            throw error;
        }
    };

    // ============================================================
    // GENERATE AI QUESTIONS
    // ============================================================

    const generateAIQuestions = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again.");
            }

            const jobResponse = await fetch(
                "http://localhost:5000/api/jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const jobData = await jobResponse.json();

            if (!jobResponse.ok) {
                throw new Error(
                    jobData.message ||
                        "Failed to load job information."
                );
            }

            let latestJob = null;

            if (
                jobData.analyses &&
                jobData.analyses.length > 0
            ) {
                latestJob = jobData.analyses[0];
            }

            const selectedJobRole =
                latestJob?.job_title ||
                jobRole ||
                "Software Engineer";

            const skills =
                latestJob?.detected_skills || "";

            const response = await fetch(
                "http://localhost:5000/api/ai/aptitude",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        jobRole: selectedJobRole,
                        skills: skills,
                        difficulty: difficulty,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "AI generation failed."
                );
            }

            if (
                !data.questions ||
                data.questions.length === 0
            ) {
                throw new Error(
                    "AI returned no questions."
                );
            }

            const formattedQuestions =
                data.questions.map((item) => ({
                    question:
                        item.question || "",

                    options:
                        Array.isArray(item.options)
                            ? item.options
                            : [],

                    answer:
                        item.answer ||
                        item.correct_answer ||
                        item.correctAnswer ||
                        "",

                    explanation:
                        item.explanation ||
                        "No explanation provided.",

                    topic:
                        item.topic ||
                        "Aptitude",

                    difficulty:
                        item.difficulty ||
                        difficulty,
                }));

            setQuestions(formattedQuestions);
            setQuestionSource("AI Generated");

            setJobRole(selectedJobRole);

            setCurrentQuestion(0);
            setSelectedAnswer("");
            setScore(0);
            setAnswered(false);
            setFinished(false);
            setIsCorrect(false);

            setError("");

            return true;
        } catch (error) {
            console.error(
                "AI question generation error:",
                error
            );

            throw error;
        }
    };

    // ============================================================
    // DATABASE QUESTIONS
    // ============================================================

    const generateDatabaseQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            resetQuiz();

            await loadDatabaseQuestions();
        } catch (error) {
            setError(
                error.message ||
                    "Failed to load questions."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // AI + DATABASE FALLBACK
    // ============================================================

    const generateQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            resetQuiz();

            try {
                await generateAIQuestions();

                return;
            } catch (aiError) {
                console.error(
                    "AI unavailable:",
                    aiError
                );

                try {
                    await loadDatabaseQuestions();

                    setError(
                        "AI generation is currently unavailable. Questions were loaded from the CareerForge question bank instead."
                    );
                } catch (databaseError) {
                    console.error(
                        "Database fallback error:",
                        databaseError
                    );

                    setError(
                        "Both AI generation and the question bank are currently unavailable."
                    );
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SUBMIT ANSWER
    // ============================================================

    const handleAnswer = () => {
        if (answered) {
            return;
        }

        const question =
            questions[currentQuestion];

        if (!question) {
            return;
        }

        const userAnswer =
            selectedAnswer.trim();

        if (!userAnswer) {
            return;
        }

        const correctAnswer =
            String(question.answer || "")
                .trim();

        /*
         * Simple comparison for now.
         *
         * We ignore capitalization and
         * extra spaces.
         */
        const correct =
            userAnswer.toLowerCase() ===
            correctAnswer.toLowerCase();

        setIsCorrect(correct);
        setAnswered(true);

        if (correct) {
            setScore(
                (previousScore) =>
                    previousScore + 1
            );
        }
    };

    // ============================================================
    // NEXT QUESTION
    // ============================================================

    const nextQuestion = () => {
        if (
            currentQuestion <
            questions.length - 1
        ) {
            setCurrentQuestion(
                (previous) =>
                    previous + 1
            );

            setSelectedAnswer("");
            setAnswered(false);
            setIsCorrect(false);
        } else {
            setFinished(true);
        }
    };

    // ============================================================
    // RESTART
    // ============================================================

    const restartTest = () => {
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setAnswered(false);
        setFinished(false);
        setIsCorrect(false);
    };

    const question =
        questions[currentQuestion];

    /*
     * Database questions currently have no options.
     * AI questions can have options.
     */
    const hasOptions =
        question &&
        Array.isArray(question.options) &&
        question.options.length > 0;

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Aptitude Practice
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Practice aptitude questions for your target job
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/interview-prep")
                    }
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                >
                    Back to Interview Prep
                </button>

            </header>

            {/* Main */}
            <main className="max-w-5xl mx-auto p-8">

                {/* Setup */}
                {questions.length === 0 &&
                    !loading &&
                    !finished && (

                        <div className="bg-white rounded-xl border shadow-sm p-8 mb-6">

                            <h2 className="text-2xl font-bold text-gray-900">
                                Aptitude Practice
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Generate fresh AI questions or practice from your CareerForge question bank.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                                {/* Job Role */}
                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Job Role
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            jobRole ||
                                            "Software Engineer"
                                        }
                                        readOnly
                                        className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
                                    />

                                </div>

                                {/* Difficulty */}
                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty
                                    </label>

                                    <select
                                        value={difficulty}
                                        onChange={(e) =>
                                            setDifficulty(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Easy">
                                            Easy
                                        </option>

                                        <option value="Medium">
                                            Medium
                                        </option>

                                        <option value="Hard">
                                            Hard
                                        </option>
                                    </select>

                                </div>

                            </div>

                            {error && (
                                <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">

                                <button
                                    onClick={
                                        generateQuestions
                                    }
                                    disabled={loading}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Generate with AI
                                </button>

                                <button
                                    onClick={
                                        generateDatabaseQuestions
                                    }
                                    disabled={loading}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Practice Question Bank
                                </button>

                            </div>

                        </div>
                    )}

                {/* Loading */}
                {loading && (

                    <div className="bg-white rounded-xl border shadow-sm p-10 text-center">

                        <div className="text-4xl">
                            🤖
                        </div>

                        <h2 className="text-xl font-bold mt-4">
                            Preparing Questions...
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Creating your aptitude practice set.
                        </p>

                    </div>
                )}

                {/* Error */}
                {!loading &&
                    questions.length === 0 &&
                    error && (

                        <div className="bg-white rounded-xl border shadow-sm p-8 text-center">

                            <p className="text-red-600">
                                {error}
                            </p>

                            <div className="flex justify-center gap-3 mt-5">

                                <button
                                    onClick={
                                        generateQuestions
                                    }
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Try AI Again
                                </button>

                                <button
                                    onClick={
                                        generateDatabaseQuestions
                                    }
                                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Use Question Bank
                                </button>

                            </div>

                        </div>
                    )}

                {/* Finished */}
                {!loading &&
                    finished && (

                        <div className="bg-white rounded-xl border shadow-sm p-10 text-center">

                            <div className="text-5xl">
                                🎯
                            </div>

                            <h2 className="text-3xl font-bold mt-5">
                                Test Completed
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Your aptitude practice result
                            </p>

                            <div className="text-5xl font-bold text-blue-600 mt-6">
                                {score}/
                                {questions.length}
                            </div>

                            <p className="text-gray-500 mt-3">
                                {questions.length > 0
                                    ? Math.round(
                                          (score /
                                              questions.length) *
                                              100
                                      )
                                    : 0}
                                % Score
                            </p>

                            <div className="mt-4">

                                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    Source:{" "}
                                    {questionSource}
                                </span>

                            </div>

                            <div className="flex justify-center flex-wrap gap-4 mt-7">

                                <button
                                    onClick={
                                        restartTest
                                    }
                                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Review Again
                                </button>

                                <button
                                    onClick={
                                        generateQuestions
                                    }
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Generate New Questions
                                </button>

                                <button
                                    onClick={
                                        generateDatabaseQuestions
                                    }
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Question Bank
                                </button>

                            </div>

                        </div>
                    )}

                {/* Question */}
                {!loading &&
                    !finished &&
                    questions.length > 0 &&
                    question && (

                        <div className="bg-white rounded-xl border shadow-sm p-8">

                            {/* Progress */}
                            <div className="flex justify-between items-center">

                                <p className="text-sm text-gray-500">
                                    Question{" "}
                                    {currentQuestion + 1}{" "}
                                    of{" "}
                                    {questions.length}
                                </p>

                                <div className="flex gap-3">

                                    {question.topic && (
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                            {question.topic}
                                        </span>
                                    )}

                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {question.difficulty ||
                                            difficulty}
                                    </span>

                                </div>

                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-5">

                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{
                                        width: `${
                                            ((currentQuestion +
                                                1) /
                                                questions.length) *
                                            100
                                        }%`,
                                    }}
                                />

                            </div>

                            {/* Source */}
                            <div className="mt-5">

                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {questionSource}
                                </span>

                            </div>

                            {/* Question */}
                            <h2 className="text-xl font-semibold mt-6 leading-relaxed">
                                {question.question}
                            </h2>

                            {/* ==================================================
                                MCQ OPTIONS
                            ================================================== */}

                            {hasOptions && (
                                <div className="space-y-3 mt-7">

                                    {question.options.map(
                                        (
                                            option,
                                            index
                                        ) => {

                                            const isSelected =
                                                selectedAnswer ===
                                                option;

                                            const optionIsCorrect =
                                                answered &&
                                                String(
                                                    option
                                                )
                                                    .trim()
                                                    .toLowerCase() ===
                                                    String(
                                                        question.answer ||
                                                            ""
                                                    )
                                                        .trim()
                                                        .toLowerCase();

                                            const isWrong =
                                                answered &&
                                                isSelected &&
                                                !optionIsCorrect;

                                            let optionClass =
                                                "border-gray-200 hover:border-blue-400 hover:bg-blue-50";

                                            if (
                                                optionIsCorrect
                                            ) {
                                                optionClass =
                                                    "border-green-500 bg-green-50 text-green-700";
                                            }

                                            if (
                                                isWrong
                                            ) {
                                                optionClass =
                                                    "border-red-500 bg-red-50 text-red-700";
                                            }

                                            return (
                                                <button
                                                    key={
                                                        index
                                                    }
                                                    disabled={
                                                        answered
                                                    }
                                                    onClick={() => {
                                                        setSelectedAnswer(
                                                            option
                                                        );
                                                    }}
                                                    className={`w-full text-left px-5 py-4 border rounded-lg transition ${optionClass}`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                            {/* ==================================================
                                OPEN ENDED ANSWER
                            ================================================== */}

                            {!hasOptions && (
                                <div className="mt-7">

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Answer
                                    </label>

                                    <textarea
                                        value={
                                            selectedAnswer
                                        }
                                        onChange={(e) =>
                                            setSelectedAnswer(
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            answered
                                        }
                                        rows="5"
                                        placeholder="Type your answer here..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />

                                </div>
                            )}

                            {/* ==================================================
                                SUBMIT ANSWER
                            ================================================== */}

                            {!answered && (
                                <button
                                    onClick={
                                        handleAnswer
                                    }
                                    disabled={
                                        !selectedAnswer.trim()
                                    }
                                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Submit Answer
                                </button>
                            )}

                            {/* ==================================================
                                RESULT
                            ================================================== */}

                            {answered && (
                                <div className="mt-6">

                                    {isCorrect ? (
                                        <div className="p-5 bg-green-50 border border-green-200 rounded-lg">

                                            <p className="text-lg font-semibold text-green-700">
                                                ✅ Correct Answer
                                            </p>

                                            <p className="text-green-700 mt-2">
                                                Good job! Your answer matches the expected answer.
                                            </p>

                                        </div>
                                    ) : (
                                        <div className="p-5 bg-red-50 border border-red-200 rounded-lg">

                                            <p className="text-lg font-semibold text-red-700">
                                                ❌ Wrong Answer
                                            </p>

                                            <p className="text-red-700 mt-2">
                                                Correct Answer:
                                            </p>

                                            <p className="text-gray-700 mt-1 font-medium">
                                                {question.answer ||
                                                    "Not available"}
                                            </p>

                                        </div>
                                    )}

                                    {/* Explanation */}
                                    <div className="mt-4 p-5 bg-gray-50 rounded-lg">

                                        <p className="font-semibold text-gray-800">
                                            Explanation
                                        </p>

                                        <p className="text-gray-600 mt-2 leading-relaxed">
                                            {question.explanation ||
                                                "No explanation available."}
                                        </p>

                                    </div>

                                </div>
                            )}

                            {/* ==================================================
                                NEXT
                            ================================================== */}

                            {answered && (
                                <button
                                    onClick={
                                        nextQuestion
                                    }
                                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {currentQuestion ===
                                    questions.length - 1
                                        ? "Finish Test"
                                        : "Next Question"}
                                </button>
                            )}

                        </div>
                    )}

            </main>

        </div>
    );
}

export default Aptitude;