import { useNavigate } from "react-router-dom";


function InterviewPrep() {

    const navigate = useNavigate();


    return (

        <div className="min-h-screen bg-gray-100">


            {/* HEADER */}

            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">

                        Interview Preparation

                    </h1>


                    <p className="text-sm text-gray-500 mt-1">

                        Prepare for every stage of your interview

                    </p>

                </div>


                <button

                    onClick={() =>
                        navigate("/dashboard")
                    }

                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"

                >

                    Back to Dashboard

                </button>

            </header>


            {/* MAIN */}

            <main className="max-w-6xl mx-auto p-8">


                <div className="mb-8">

                    <h2 className="text-2xl font-bold text-gray-900">

                        Choose Your Preparation

                    </h2>


                    <p className="text-gray-500 mt-2">

                        Practice questions based on your resume,
                        skills and target job.

                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                    {/* ================================================== */}
                    {/* APTITUDE */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            🧠
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            Aptitude
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Practice quantitative aptitude,
                            logical reasoning and
                            problem-solving questions.

                        </p>


                        <button

                            onClick={() =>
                                navigate("/aptitude")
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Start Practice

                        </button>

                    </div>


                    {/* ================================================== */}
                    {/* CODING */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            💻
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            Coding Questions
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Practice DSA, programming
                            and job-specific coding
                            questions.

                        </p>


                        <button

                            onClick={() =>
                                navigate("/coding")
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Start Practice

                        </button>

                    </div>


                    {/* ================================================== */}
                    {/* TECHNICAL THEORY */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            📚
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            Technical Theory
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Practice questions from programming,
                            DBMS, SQL, OOP, web development
                            and more.

                        </p>


                        <button

                            onClick={() =>
                                navigate(
                                    "/technical-theory"
                                )
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Start Practice

                        </button>

                    </div>


                    {/* ================================================== */}
                    {/* RESUME */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            📄
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            Resume Questions
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Practice questions based on
                            your skills, experience,
                            projects, education and resume.

                        </p>


                        <button

                            onClick={() =>
                                navigate(
                                    "/resume-questions"
                                )
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Practice Resume

                        </button>

                    </div>


                    {/* ================================================== */}
                    {/* COMPANY */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            🏢
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            Company Round
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Prepare for company,
                            organization and role-specific
                            interview questions.

                        </p>


                        <button

                            onClick={() =>
                                navigate(
                                    "/company-round"
                                )
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Prepare Company Round

                        </button>

                    </div>


                    {/* ================================================== */}
                    {/* MANAGER */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            👨‍💼
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            Manager Round
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Practice ownership,
                            teamwork, prioritization,
                            conflict and situational questions.

                        </p>


                        <button

                            onClick={() =>
                                navigate(
                                    "/manager-round"
                                )
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Practice Manager Round

                        </button>

                    </div>


                    {/* ================================================== */}
                    {/* HR */}
                    {/* ================================================== */}

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="text-3xl">
                            👤
                        </div>


                        <h3 className="text-xl font-semibold mt-4">
                            HR / Behavioral
                        </h3>


                        <p className="text-gray-500 mt-2">

                            Prepare for common HR,
                            behavioral and career-related
                            interview questions.

                        </p>


                        <button

                            onClick={() =>
                                navigate(
                                    "/hr-round"
                                )
                            }

                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >

                            Practice HR Round

                        </button>

                    </div>


                </div>

            </main>

        </div>

    );

}


export default InterviewPrep;
