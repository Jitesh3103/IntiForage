import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TechnicalTheory() {
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

    // Timer
    useEffect(() => {
        if (questions.length === 0) return;
        if (testFinished) return;
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [questions.length, timeLeft, testFinished]);

    // Finish when timer reaches zero
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

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;
    };

    const startPractice = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "https://intiforage-backend.onrender.com/api/interview/questions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        category: "Technical Theory",
                        difficulty: difficulty
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load Technical Theory questions"
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
            setTestFinished(false);

        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "Unable to load Technical Theory questions."
            );

        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = () => {
        if (!selectedAnswer) return;
        if (submitted) return;

        const currentQuestion =
            questions[currentIndex];

        const correctAnswer =
            currentQuestion.correct_answer;

        const correct =
            selectedAnswer.trim().toLowerCase() ===
            correctAnswer?.trim().toLowerCase();

        if (correct) {
            setScore((prev) => prev + 1);
        }

        setAnswers((prev) => [
            ...prev,
            {
                questionNumber: currentIndex + 1,
                question: currentQuestion.question,
                selectedAnswer,
                correctAnswer,
                correct
            }
        ]);

        setSubmitted(true);
    };

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
            setTestFinished(true);
            setCurrentIndex(questions.length);
        }
    };

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

    // Setup screen
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-4xl mx-auto">

                    <button
                        onClick={() =>
                            navigate("/interview-prep")
                        }
                        className="mb-6 text-blue-600 hover:underline"
                    >
                        ← Back to Interview Prep
                    </button>

                    <div className="bg-white rounded-2xl shadow p-8">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Technical Theory
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Practice questions from programming,
                            OOP, DBMS, SQL, operating systems,
                            networking, web development and more.
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
                                className="w-full md:w-64 border rounded-lg px-4 py-3"
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
                            <p className="mt-4 text-red-600">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={startPractice}
                            disabled={loading}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Loading..."
                                : "Start Practice"}
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // Final result
    if (testFinished) {
        const total = questions.length;

        const percentage =
            total > 0
                ? Math.round(
                    (score / total) * 100
                )
                : 0;

        const wrong =
            answers.filter(
                (answer) => !answer.correct
            ).length;

        const unanswered =
            total - answers.length;

        const timeUsed =
            15 * 60 - timeLeft;

        const usedMinutes =
            Math.floor(timeUsed / 60);

        const usedSeconds =
            timeUsed % 60;

        return (
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-5xl mx-auto">

                    <div className="bg-white rounded-2xl shadow p-8">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Technical Theory Result
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                            <div className="bg-blue-50 p-5 rounded-xl text-center">
                                <p className="text-gray-500">
                                    Score
                                </p>

                                <p className="text-3xl font-bold text-blue-600">
                                    {score}/{total}
                                </p>
                            </div>

                            <div className="bg-green-50 p-5 rounded-xl text-center">
                                <p className="text-gray-500">
                                    Percentage
                                </p>

                                <p className="text-3xl font-bold text-green-600">
                                    {percentage}%
                                </p>
                            </div>

                            <div className="bg-red-50 p-5 rounded-xl text-center">
                                <p className="text-gray-500">
                                    Wrong
                                </p>

                                <p className="text-3xl font-bold text-red-600">
                                    {wrong}
                                </p>
                            </div>

                            <div className="bg-gray-100 p-5 rounded-xl text-center">
                                <p className="text-gray-500">
                                    Unanswered
                                </p>

                                <p className="text-3xl font-bold text-gray-700">
                                    {unanswered}
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 text-gray-600">
                            Time used:{" "}
                            <b>
                                {usedMinutes}m{" "}
                                {usedSeconds}s
                            </b>
                        </div>

                        <div className="mt-8 flex gap-4">

                            <button
                                onClick={restartPractice}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Practice Again
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/interview-prep"
                                    )
                                }
                                className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
                            >
                                Back to Interview Prep
                            </button>

                        </div>

                        <div className="mt-10">

                            <h2 className="text-xl font-bold mb-4">
                                Question Review
                            </h2>

                            <div className="space-y-4">

                                {answers.map(
                                    (answer, index) => (
                                        <div
                                            key={index}
                                            className={`border rounded-xl p-5 ${
                                                answer.correct
                                                    ? "border-green-300 bg-green-50"
                                                    : "border-red-300 bg-red-50"
                                            }`}
                                        >

                                            <p className="font-semibold">
                                                Q
                                                {answer.questionNumber}.{" "}
                                                {answer.question}
                                            </p>

                                            <p className="mt-2">
                                                Your answer:{" "}
                                                <span className="font-medium">
                                                    {answer.selectedAnswer}
                                                </span>
                                            </p>

                                            <p className="mt-1">
                                                Correct answer:{" "}
                                                <span className="font-medium">
                                                    {answer.correctAnswer}
                                                </span>
                                            </p>

                                            <p className="mt-2 font-semibold">
                                                {answer.correct
                                                    ? "✓ Correct"
                                                    : "✗ Incorrect"}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    const currentQuestion =
        questions[currentIndex];

    let options = [];

    try {
        options = Array.isArray(
            currentQuestion.options
        )
            ? currentQuestion.options
            : JSON.parse(
                currentQuestion.options || "[]"
            );
    } catch {
        options = [];
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-6">

                    <button
                        onClick={() =>
                            navigate(
                                "/interview-prep"
                            )
                        }
                        className="text-blue-600 hover:underline"
                    >
                        ← Back
                    </button>

                    <div className="font-bold text-lg">
                        Time:{" "}
                        <span className="text-blue-600">
                            {formatTime()}
                        </span>
                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow p-8">

                    <div className="flex justify-between items-center">

                        <p className="text-gray-500">
                            Question{" "}
                            {currentIndex + 1} of{" "}
                            {questions.length}
                        </p>

                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                            {difficulty}
                        </span>

                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mt-6">
                        {currentQuestion.question}
                    </h2>

                    <div className="mt-6 space-y-3">

                        {options.map(
                            (option, index) => {

                                const isSelected =
                                    selectedAnswer ===
                                    option;

                                const isCorrect =
                                    submitted &&
                                    option.trim()
                                        .toLowerCase() ===
                                    currentQuestion.correct_answer
                                        ?.trim()
                                        .toLowerCase();

                                const isWrong =
                                    submitted &&
                                    isSelected &&
                                    !isCorrect;

                                let optionClass =
                                    "border-gray-300";

                                if (
                                    isCorrect
                                ) {
                                    optionClass =
                                        "border-green-500 bg-green-50";
                                } else if (
                                    isWrong
                                ) {
                                    optionClass =
                                        "border-red-500 bg-red-50";
                                } else if (
                                    isSelected
                                ) {
                                    optionClass =
                                        "border-blue-500 bg-blue-50";
                                }

                                return (
                                    <button
                                        key={index}
                                        disabled={
                                            submitted
                                        }
                                        onClick={() =>
                                            setSelectedAnswer(
                                                option
                                            )
                                        }
                                        className={`w-full text-left border-2 rounded-xl p-4 transition ${optionClass}`}
                                    >
                                        <span className="font-semibold mr-2">
                                            {String.fromCharCode(
                                                65 + index
                                            )}
                                            .
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
                                selectedAnswer
                                    .trim()
                                    .toLowerCase() ===
                                currentQuestion.correct_answer
                                    ?.trim()
                                    .toLowerCase()
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {selectedAnswer
                                .trim()
                                .toLowerCase() ===
                            currentQuestion.correct_answer
                                ?.trim()
                                .toLowerCase()
                                ? "✓ Correct answer!"
                                : `✗ Incorrect. Correct answer: ${currentQuestion.correct_answer}`}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">

                        {!submitted ? (
                            <button
                                onClick={submitAnswer}
                                disabled={!selectedAnswer}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={nextQuestion}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                            >
                                {currentIndex ===
                                questions.length - 1
                                    ? "Finish Test"
                                    : "Next Question"}
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default TechnicalTheory;
