import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumeQuestions() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/interview/resume-questions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load resume questions"
                );
            }

            setQuestions(data.questions || []);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentIndex];

    const wordCount = answer.trim()
        ? answer.trim().split(/\s+/).length
        : 0;

    const submitAnswer = () => {
        if (!answer.trim()) {
            return;
        }

        const result = {
            question: currentQuestion.question,
            answer: answer,
            wordCount: wordCount,
            minWords: currentQuestion.expected_min_words,
            maxWords: currentQuestion.expected_max_words,
            withinRange:
                wordCount >= currentQuestion.expected_min_words &&
                wordCount <= currentQuestion.expected_max_words
        };

        setResults([...results, result]);
        setSubmitted(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswer("");
            setSubmitted(false);
        }
    };

    const finishPractice = () => {
        navigate("/interview-prep");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600">
                    Loading resume questions...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        Unable to load questions
                    </h2>

                    <p className="text-red-500 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/interview-prep")}
                        className="mt-6 px-5 py-2 bg-gray-900 text-white rounded-lg"
                    >
                        Back to Interview Preparation
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <h2 className="text-xl font-bold">
                        No Resume Questions Available
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Please upload and analyze your resume first.
                    </p>

                    <button
                        onClick={() => navigate("/resume-analyzer")}
                        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Analyze Resume
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Resume Questions
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Practice questions based on your resume
                    </p>
                </div>

                <button
                    onClick={() => navigate("/interview-prep")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                >
                    Back
                </button>
            </header>

            <main className="max-w-4xl mx-auto p-8">

                {/* Progress */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">
                        Question {currentIndex + 1} of {questions.length}
                    </p>

                    <p className="text-sm text-gray-500">
                        Answer in{" "}
                        {currentQuestion.expected_min_words}–
                        {currentQuestion.expected_max_words} words
                    </p>
                </div>

                {/* Question */}
                <div className="bg-white rounded-xl border shadow-sm p-8">

                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                        {currentQuestion.question}
                    </h2>

                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                            Try to answer in{" "}
                            <strong>
                                {currentQuestion.expected_min_words}–
                                {currentQuestion.expected_max_words}
                            </strong>{" "}
                            words.
                        </p>
                    </div>

                    {!submitted ? (
                        <>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Write your interview answer here..."
                                rows={10}
                                className="w-full mt-6 border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex justify-between items-center mt-3">
                                <p className="text-sm text-gray-500">
                                    Words: {wordCount}
                                </p>

                                <button
                                    onClick={submitAnswer}
                                    disabled={!answer.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                                >
                                    Submit Answer
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="mt-6">

                            <div className="bg-gray-50 border rounded-lg p-5">
                                <p className="text-sm text-gray-500 mb-2">
                                    Your Answer
                                </p>

                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {answer}
                                </p>
                            </div>

                            <div
                                className={`mt-5 p-5 rounded-lg border ${
                                    wordCount >=
                                        currentQuestion.expected_min_words &&
                                    wordCount <=
                                        currentQuestion.expected_max_words
                                        ? "bg-green-50 border-green-200"
                                        : "bg-yellow-50 border-yellow-200"
                                }`}
                            >
                                <p className="font-semibold">
                                    Answer Length: {wordCount} words
                                </p>

                                <p className="text-sm mt-1">
                                    Expected:{" "}
                                    {currentQuestion.expected_min_words}–
                                    {currentQuestion.expected_max_words} words
                                </p>

                                {wordCount <
                                    currentQuestion.expected_min_words && (
                                    <p className="text-sm mt-2 text-yellow-700">
                                        Try adding more detail to your answer.
                                    </p>
                                )}

                                {wordCount >
                                    currentQuestion.expected_max_words && (
                                    <p className="text-sm mt-2 text-yellow-700">
                                        Try making your answer more concise.
                                    </p>
                                )}

                                {wordCount >=
                                    currentQuestion.expected_min_words &&
                                    wordCount <=
                                        currentQuestion.expected_max_words && (
                                        <p className="text-sm mt-2 text-green-700">
                                            Your answer is within the suggested
                                            length.
                                        </p>
                                    )}
                            </div>

                            <div className="flex justify-end mt-6">
                                {currentIndex <
                                questions.length - 1 ? (
                                    <button
                                        onClick={nextQuestion}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Next Question
                                    </button>
                                ) : (
                                    <button
                                        onClick={finishPractice}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Finish Practice
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

export default ResumeQuestions;