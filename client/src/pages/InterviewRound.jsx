import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewRound({ round }) {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [job, setJob] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ========================================================
    // ROUND INFORMATION
    // ========================================================

    const roundInformation = {

        company: {
            title: "Company Round",
            subtitle:
                "Prepare for company and role-specific questions",
            icon: "🏢"
        },

        manager: {
            title: "Manager Round",
            subtitle:
                "Practice ownership, teamwork and situational questions",
            icon: "👨‍💼"
        },

        hr: {
            title: "HR / Behavioral",
            subtitle:
                "Prepare for HR and behavioral interview questions",
            icon: "👤"
        }

    };


    const currentRound =
        roundInformation[round] ||
        roundInformation.hr;


    // ========================================================
    // LOAD QUESTIONS
    // ========================================================

    useEffect(() => {

        fetchQuestions();

    }, [round]);


    const fetchQuestions = async () => {

        try {

            setLoading(true);
            setError("");

            setQuestions([]);
            setCurrentIndex(0);
            setAnswer("");
            setSubmitted(false);


            const token =
                localStorage.getItem("token");


            if (!token) {

                throw new Error(
                    "Please login before starting the interview."
                );

            }


            if (
                !round ||
                !["company", "manager", "hr"].includes(round)
            ) {

                throw new Error(
                    "Invalid interview round."
                );

            }


            const response = await fetch(

                `http://localhost:5000/api/interview/round/${round}`,

                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }

            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load interview questions."
                );

            }


            setQuestions(
                data.questions || []
            );


            setJob(
                data.job || null
            );


        } catch (error) {

            console.error(
                "Interview round error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // CURRENT QUESTION
    // ========================================================

    const currentQuestion =
        questions[currentIndex];


    // ========================================================
    // WORD COUNT
    // ========================================================

    const wordCount =
        answer.trim()
            ? answer.trim().split(/\s+/).length
            : 0;


    // ========================================================
    // SUBMIT ANSWER
    // ========================================================

    const submitAnswer = () => {

        if (!answer.trim()) {
            return;
        }

        setSubmitted(true);

    };


    // ========================================================
    // NEXT QUESTION
    // ========================================================

    const nextQuestion = () => {

        if (
            currentIndex <
            questions.length - 1
        ) {

            setCurrentIndex(
                currentIndex + 1
            );

            setAnswer("");
            setSubmitted(false);

        }

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="text-center">

                    <div className="text-4xl mb-4">
                        ⏳
                    </div>

                    <p className="text-gray-600">
                        Preparing{" "}
                        {currentRound.title.toLowerCase()}...
                    </p>

                </div>

            </div>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

                <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">

                    <div className="text-4xl">
                        ⚠️
                    </div>


                    <h2 className="text-xl font-bold text-gray-900 mt-4">

                        Unable to start round

                    </h2>


                    <p className="text-red-500 mt-3">

                        {error}

                    </p>


                    <p className="text-gray-500 text-sm mt-3">

                        Analyze a job description first,
                        then return to this interview round.

                    </p>


                    <div className="flex gap-3 justify-center mt-6 flex-wrap">

                        <button
                            onClick={() =>
                                navigate("/job-analyzer")
                            }
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >

                            Analyze Job

                        </button>


                        <button
                            onClick={() =>
                                navigate("/interview-prep")
                            }
                            className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                        >

                            Back

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ========================================================
    // NO QUESTIONS
    // ========================================================

    if (
        !currentQuestion ||
        questions.length === 0
    ) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

                <div className="bg-white p-8 rounded-xl shadow-sm text-center">

                    <div className="text-4xl">
                        📭
                    </div>


                    <h2 className="text-xl font-bold mt-4">

                        No questions available

                    </h2>


                    <p className="text-gray-500 mt-2">

                        We couldn't generate questions
                        for this round.

                    </p>


                    <button
                        onClick={() =>
                            navigate("/interview-prep")
                        }
                        className="mt-6 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                    >

                        Back to Interview Preparation

                    </button>

                </div>

            </div>

        );

    }


    // ========================================================
    // MAIN PAGE
    // ========================================================

    return (

        <div className="min-h-screen bg-gray-100">


            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <span className="text-3xl">
                        {currentRound.icon}
                    </span>


                    <div>

                        <h1 className="text-2xl font-bold text-gray-900">

                            {currentRound.title}

                        </h1>


                        <p className="text-sm text-gray-500 mt-1">

                            {currentRound.subtitle}

                        </p>

                    </div>

                </div>


                <button
                    onClick={() =>
                        navigate("/interview-prep")
                    }
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                >

                    Back

                </button>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="max-w-4xl mx-auto p-8">


                {/* ==================================================
                    JOB INFORMATION
                ================================================== */}

                {job && (

                    <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">

                        <div className="flex flex-wrap gap-3">


                            {job.company && (

                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">

                                    🏢 {job.company}

                                </span>

                            )}


                            {job.job_title && (

                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">

                                    💼 {job.job_title}

                                </span>

                            )}

                        </div>

                    </div>

                )}


                {/* ==================================================
                    PROGRESS TEXT
                ================================================== */}

                <div className="flex justify-between items-center mb-3">

                    <p className="text-sm text-gray-500">

                        Question{" "}
                        {currentIndex + 1}
                        {" "}of{" "}
                        {questions.length}

                    </p>


                    <p className="text-sm text-gray-500">

                        {Math.round(
                            ((currentIndex + 1) /
                                questions.length) *
                            100
                        )}% complete

                    </p>

                </div>


                {/* ==================================================
                    PROGRESS BAR
                ================================================== */}

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">

                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                            width:
                                `${((currentIndex + 1) /
                                    questions.length) *
                                100}%`
                        }}
                    />

                </div>


                {/* ==================================================
                    QUESTION CARD
                ================================================== */}

                <div className="bg-white rounded-xl border shadow-sm p-8">


                    {/* QUESTION TYPE */}

                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">

                        {currentQuestion.type}

                    </span>


                    {/* QUESTION */}

                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mt-5">

                        {currentQuestion.question}

                    </h2>


                    {/* EXPECTED WORD COUNT */}

                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">

                        <p className="text-sm text-blue-700">

                            Recommended answer:

                            {" "}

                            <strong>

                                {currentQuestion.expected_min_words}
                                –
                                {currentQuestion.expected_max_words}

                            </strong>

                            {" "}words

                        </p>

                    </div>


                    {/* ==================================================
                        ANSWER INPUT
                    ================================================== */}

                    {!submitted ? (

                        <>

                            <textarea
                                value={answer}
                                onChange={(e) =>
                                    setAnswer(
                                        e.target.value
                                    )
                                }
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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >

                                    Submit Answer

                                </button>

                            </div>

                        </>

                    ) : (

                        /* ==================================================
                           ANSWER RESULT
                        ================================================== */

                        <div className="mt-6">


                            {/* USER ANSWER */}

                            <div className="bg-gray-50 border rounded-lg p-5">

                                <p className="text-sm text-gray-500 mb-2">

                                    Your Answer

                                </p>


                                <p className="text-gray-800 whitespace-pre-wrap">

                                    {answer}

                                </p>

                            </div>


                            {/* WORD COUNT FEEDBACK */}

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

                                    Answer Length:
                                    {" "}
                                    {wordCount}
                                    {" "}words

                                </p>


                                <p className="text-sm mt-1">

                                    Expected:
                                    {" "}
                                    {currentQuestion.expected_min_words}
                                    –
                                    {currentQuestion.expected_max_words}
                                    {" "}words

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

                                        Your answer is within the suggested length.

                                    </p>

                                )}

                            </div>


                            {/* NEXT / FINISH */}

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
                                        onClick={() =>
                                            navigate("/interview-prep")
                                        }
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

export default InterviewRound;