import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Coding() {
    const navigate = useNavigate();

    const [difficulty, setDifficulty] = useState("Medium");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const [answers, setAnswers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [timeLeft, setTimeLeft] = useState(15 * 60);

    const [testFinished, setTestFinished] = useState(false);

    const token = localStorage.getItem("token");

    // --------------------------------
    // TIMER
    // --------------------------------

    useEffect(() => {
        if (questions.length === 0) {
            return;
        }

        // Stop timer after test is completed
        if (testFinished) {
            return;
        }

        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [questions.length, timeLeft, testFinished]);

    // --------------------------------
    // TIME UP
    // --------------------------------

    useEffect(() => {
        if (
            questions.length > 0 &&
            timeLeft === 0 &&
            !testFinished
        ) {
            setTestFinished(true);
            setCurrentIndex(questions.length);
        }
    }, [timeLeft, questions.length, testFinished]);

    // --------------------------------
    // START PRACTICE
    // --------------------------------

    const startPractice = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/interview/questions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        category: "Coding / DSA",
                        difficulty: difficulty
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load questions"
                );
            }

            if (
                !data.questions ||
                data.questions.length === 0
            ) {
                setError(
                    "No questions found for this difficulty."
                );

                setQuestions([]);

                return;
            }

            setQuestions(data.questions);
            setCurrentIndex(0);
            setSelectedAnswer("");
            setSubmitted(false);
            setScore(0);
            setAnswers([]);

            setTimeLeft(15 * 60);

            // Start timer again
            setTestFinished(false);

        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "Unable to load coding questions."
            );

        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // SUBMIT ANSWER
    // --------------------------------

    const submitAnswer = () => {
        if (!selectedAnswer) {
            return;
        }

        if (submitted) {
            return;
        }

        const currentQuestion =
            questions[currentIndex];

        const correctAnswer =
            currentQuestion.correct_answer;

        const correct =
            selectedAnswer
                .trim()
                .toLowerCase() ===
            correctAnswer
                ?.trim()
                .toLowerCase();

        if (correct) {
            setScore((prev) => prev + 1);
        }

        setAnswers((prev) => [
            ...prev,
            {
                questionNumber:
                    currentIndex + 1,

                question:
                    currentQuestion.question,

                selectedAnswer:
                    selectedAnswer,

                correctAnswer:
                    correctAnswer,

                correct: correct
            }
        ]);

        setSubmitted(true);
    };

    // --------------------------------
    // NEXT QUESTION
    // --------------------------------

    const nextQuestion = () => {
        if (
            currentIndex <
            questions.length - 1
        ) {
            setCurrentIndex(
                (prev) => prev + 1
            );

            setSelectedAnswer("");
            setSubmitted(false);

        } else {
            // All questions completed
            setTestFinished(true);
            setCurrentIndex(questions.length);
        }
    };

    // --------------------------------
    // RESTART
    // --------------------------------

    const restartPractice = () => {
        setQuestions([]);
        setCurrentIndex(0);
        setSelectedAnswer("");
        setSubmitted(false);
        setScore(0);
        setAnswers([]);
        setError("");

        setTimeLeft(15 * 60);

        setTestFinished(false);
    };

    // --------------------------------
    // SETUP SCREEN
    // --------------------------------

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100">

                <div className="max-w-4xl mx-auto px-6 py-8">

                    <button
                        onClick={() =>
                            navigate("/interview-prep")
                        }
                        className="text-blue-600 hover:underline mb-6"
                    >
                        ← Back to Interview Prep
                    </button>

                    <div className="bg-white rounded-2xl shadow p-8">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Coding / DSA Practice
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Practice Coding and Data
                            Structures & Algorithms
                            questions.
                        </p>

                        <div className="mt-8">

                            <label className="block font-semibold text-gray-700 mb-2">
                                Select Difficulty
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
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

                        {error && (
                            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={startPractice}
                            disabled={loading}
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Loading Questions..."
                                : "Start Coding Practice"}
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // --------------------------------
    // FINAL RESULT
    // --------------------------------

    if (
        currentIndex >=
        questions.length
    ) {
        const totalQuestions =
            questions.length;

        const correctAnswers =
            answers.filter(
                (item) => item.correct
            ).length;

        const answeredQuestions =
            answers.length;

        const wrongAnswers =
            answeredQuestions -
            correctAnswers;

        const unansweredQuestions =
            totalQuestions -
            answeredQuestions;

        const percentage =
            totalQuestions > 0
                ? Math.round(
                      (correctAnswers /
                          totalQuestions) *
                          100
                  )
                : 0;

        const timeUsed =
            15 * 60 - timeLeft;

        const usedMinutes =
            Math.floor(timeUsed / 60);

        const usedSeconds =
            timeUsed % 60;

        return (
            <div className="min-h-screen bg-gray-100">

                <div className="max-w-5xl mx-auto px-6 py-8">

                    <button
                        onClick={() =>
                            navigate(
                                "/interview-prep"
                            )
                        }
                        className="text-blue-600 hover:underline mb-6"
                    >
                        ← Back to Interview Prep
                    </button>

                    <div className="bg-white rounded-2xl shadow p-8 text-center">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Coding / DSA Practice Completed 🎉
                        </h1>

                        {timeLeft === 0 && (
                            <p className="mt-3 text-red-600 font-semibold">
                                ⏰ Time's up!
                            </p>
                        )}

                        <p className="text-gray-500 mt-6">
                            Your Score
                        </p>

                        <div className="text-6xl font-bold text-blue-600 mt-2">
                            {correctAnswers} / {totalQuestions}
                        </div>

                        <p className="text-xl font-semibold text-gray-700 mt-2">
                            {percentage}%
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                            <div className="bg-green-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    Correct
                                </p>

                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {correctAnswers}
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    Wrong
                                </p>

                                <p className="text-2xl font-bold text-red-600 mt-1">
                                    {wrongAnswers}
                                </p>
                            </div>

                            <div className="bg-yellow-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    Unanswered
                                </p>

                                <p className="text-2xl font-bold text-yellow-600 mt-1">
                                    {unansweredQuestions}
                                </p>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-5">
                                <p className="text-sm text-gray-500">
                                    Time Used
                                </p>

                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {usedMinutes
                                        .toString()
                                        .padStart(2, "0")}
                                    :
                                    {usedSeconds
                                        .toString()
                                        .padStart(2, "0")}
                                </p>
                            </div>

                        </div>

                        <p className="text-gray-500 mt-6">
                            Difficulty:{" "}
                            <strong>
                                {difficulty}
                            </strong>
                        </p>

                    </div>

                    {/* QUESTION REVIEW */}

                    <div className="mt-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            Question Review
                        </h2>

                        {questions.map(
                            (question, index) => {

                                const result =
                                    answers.find(
                                        (item) =>
                                            item.questionNumber ===
                                            index + 1
                                    );

                                const isCorrect =
                                    result?.correct;

                                return (
                                    <div
                                        key={question.id}
                                        className="bg-white rounded-xl shadow-sm border p-6 mb-4"
                                    >

                                        <div className="flex justify-between items-start gap-4">

                                            <p className="font-semibold text-gray-800">
                                                Q{index + 1}.{" "}
                                                {question.question}
                                            </p>

                                            <span
                                                className={`shrink-0 px-3 py-1 rounded-full text-sm font-semibold ${
                                                    isCorrect
                                                        ? "bg-green-100 text-green-700"
                                                        : result
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {isCorrect
                                                    ? "Correct"
                                                    : result
                                                    ? "Wrong"
                                                    : "Not Answered"}
                                            </span>

                                        </div>

                                        <div className="mt-4 text-sm">

                                            <p className="text-gray-600">
                                                Your Answer:
                                            </p>

                                            <p
                                                className={`mt-1 font-medium ${
                                                    isCorrect
                                                        ? "text-green-600"
                                                        : result
                                                        ? "text-red-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {result?.selectedAnswer ||
                                                    "Not answered"}
                                            </p>

                                        </div>

                                        <div className="mt-3 text-sm">

                                            <p className="text-gray-600">
                                                Correct Answer:
                                            </p>

                                            <p className="mt-1 font-medium text-green-600">
                                                {
                                                    question.correct_answer
                                                }
                                            </p>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    {/* BUTTONS */}

                    <div className="flex flex-col md:flex-row gap-3 mt-8">

                        <button
                            onClick={restartPractice}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Practice Again
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/interview-prep"
                                )
                            }
                            className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                        >
                            Back to Interview Prep
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // --------------------------------
    // CURRENT QUESTION
    // --------------------------------

    const currentQuestion =
        questions[currentIndex];

    let options = [];

    try {
        if (
            Array.isArray(
                currentQuestion.options
            )
        ) {
            options =
                currentQuestion.options;
        } else if (
            typeof currentQuestion.options ===
            "string"
        ) {
            options = JSON.parse(
                currentQuestion.options
            );
        }
    } catch (error) {
        options = [];
    }

    const isCorrect =
        selectedAnswer
            .trim()
            .toLowerCase() ===
        currentQuestion.correct_answer
            ?.trim()
            .toLowerCase();

    const minutes = Math.floor(
        timeLeft / 60
    )
        .toString()
        .padStart(2, "0");

    const seconds = (
        timeLeft % 60
    )
        .toString()
        .padStart(2, "0");

    // --------------------------------
    // QUESTION SCREEN
    // --------------------------------

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-4xl mx-auto px-6 py-8">

                <button
                    onClick={() =>
                        navigate(
                            "/interview-prep"
                        )
                    }
                    className="text-blue-600 hover:underline mb-6"
                >
                    ← Back to Interview Prep
                </button>

                <div className="bg-white rounded-2xl shadow p-8">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <p className="text-sm text-gray-500">
                                Question{" "}
                                {currentIndex + 1}{" "}
                                of{" "}
                                {questions.length}
                            </p>

                            <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {
                                    currentQuestion.subcategory
                                }
                            </span>

                        </div>

                        <div className="text-right">

                            <div
                                className={`text-2xl font-bold ${
                                    timeLeft <= 60
                                        ? "text-red-600"
                                        : "text-gray-800"
                                }`}
                            >
                                {minutes}:{seconds}
                            </div>

                            <span className="text-xs text-gray-500">
                                Time Remaining
                            </span>

                        </div>

                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                        {currentQuestion.question}
                    </h2>

                    <div className="mt-6 space-y-3">

                        {options.map(
                            (option, index) => {

                                const optionLetter =
                                    String.fromCharCode(
                                        65 + index
                                    );

                                const isSelected =
                                    selectedAnswer ===
                                    option;

                                const isCorrectOption =
                                    submitted &&
                                    option ===
                                        currentQuestion.correct_answer;

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            !submitted &&
                                            setSelectedAnswer(
                                                option
                                            )
                                        }
                                        className={`w-full text-left border rounded-lg p-4 transition ${
                                            isSelected
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-300 hover:bg-gray-50"
                                        } ${
                                            isCorrectOption
                                                ? "border-green-500 bg-green-50"
                                                : ""
                                        }`}
                                    >

                                        <span className="font-semibold mr-3">
                                            {optionLetter}.
                                        </span>

                                        {option}

                                    </button>
                                );
                            }
                        )}

                    </div>

                    {submitted && (
                        <div
                            className={`mt-6 p-4 rounded-lg ${
                                isCorrect
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >

                            <p className="font-bold">
                                {isCorrect
                                    ? "✅ Correct Answer"
                                    : "❌ Wrong Answer"}
                            </p>

                            {!isCorrect && (
                                <p className="mt-2">
                                    Correct Answer:{" "}
                                    <strong>
                                        {
                                            currentQuestion.correct_answer
                                        }
                                    </strong>
                                </p>
                            )}

                            {currentQuestion.explanation && (
                                <p className="mt-2">
                                    Explanation:{" "}
                                    {
                                        currentQuestion.explanation
                                    }
                                </p>
                            )}

                        </div>
                    )}

                    <div className="mt-8 flex justify-between items-center">

                        <div className="text-gray-600">
                            Score:{" "}
                            <strong>
                                {score}
                            </strong>
                        </div>

                        {!submitted ? (

                            <button
                                onClick={submitAnswer}
                                disabled={!selectedAnswer}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                Submit Answer
                            </button>

                        ) : currentIndex <
                          questions.length - 1 ? (

                            <button
                                onClick={nextQuestion}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Next Question →
                            </button>

                        ) : (

                            <button
                                onClick={nextQuestion}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                            >
                                View Result
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Coding;