import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [user, setUser] = useState(null);
    const [resumeScore, setResumeScore] = useState(null);
    const [applicationCount, setApplicationCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);

    const navigate = useNavigate();


    // =====================================================
    // Load Dashboard Data
    // =====================================================

    useEffect(() => {

        const token = localStorage.getItem("token");


        // -------------------------------------------------
        // Check Authentication
        // -------------------------------------------------

        if (!token) {

            navigate("/login");

            return;
        }


        // -------------------------------------------------
        // Fetch Logged-In User
        // -------------------------------------------------

        fetch("https://intiforage-backend.onrender.com/api/auth/me", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error("Unauthorized");

                }

                return response.json();

            })

            .then((data) => {

                setUser(data.user);

            })

            .catch(() => {

                localStorage.removeItem("token");

                navigate("/login");

            });


        // -------------------------------------------------
        // Fetch User's Latest Resume
        // -------------------------------------------------

        fetch("https://intiforage-backend.onrender.com/api/resume/latest", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error("Failed to fetch resume");

                }

                return response.json();

            })

            .then((data) => {

                if (
                    data.resume &&
                    data.resume.analysis &&
                    data.resume.analysis.score !== undefined
                ) {

                    setResumeScore(
                        data.resume.analysis.score
                    );

                } else {

                    setResumeScore(null);

                }

            })

            .catch((error) => {

                console.error(
                    "Resume score error:",
                    error
                );

                setResumeScore(null);

            });


        // -------------------------------------------------
        // Fetch Job Analyses
        // -------------------------------------------------

        fetch("https://intiforage-backend.onrender.com/api/jobs", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch job analyses"
                    );

                }

                return response.json();

            })

            .then((data) => {

                setJobCount(

                    Array.isArray(data.analyses)
                        ? data.analyses.length
                        : 0

                );

            })

            .catch((error) => {

                console.error(
                    "Job count error:",
                    error
                );

            });


        // -------------------------------------------------
        // Fetch Applications
        // -------------------------------------------------

        fetch("https://intiforage-backend.onrender.com/api/applications", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch applications"
                    );

                }

                return response.json();

            })

            .then((data) => {

                setApplicationCount(

                    Array.isArray(data.applications)
                        ? data.applications.length
                        : 0

                );

            })

            .catch((error) => {

                console.error(
                    "Application count error:",
                    error
                );

            });

    }, [navigate]);


    // =====================================================
    // Logout
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        // Go to Home page after logout
        navigate("/");

    };


    // =====================================================
    // Loading
    // =====================================================

    if (!user) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <p className="text-gray-600">

                    Loading...

                </p>

            </div>

        );

    }


    // =====================================================
    // Dashboard UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-100 flex">


            {/* =================================================
                Sidebar
            ================================================= */}

            <aside className="w-64 bg-white border-r min-h-screen p-6">


                <h1 className="text-2xl font-bold text-blue-600 mb-10">

                    IntiForage

                </h1>


                <nav className="space-y-3">


                    {/* Dashboard */}

                    <button

                        className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"

                    >

                        Dashboard

                    </button>


                    {/* Resume Analyzer */}

                    <button

                        onClick={() => navigate("/resume-analyzer")}

                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"

                    >

                        Resume Analyzer

                    </button>


                    {/* Job Analyzer */}

                    <button

                        onClick={() => navigate("/job-analyzer")}

                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"

                    >

                        Job Analyzer

                    </button>


                    {/* Applications */}

                    <button

                        onClick={() => navigate("/applications")}

                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"

                    >

                        Applications

                    </button>


                    {/* Skill Gap */}

                    <button

                        onClick={() => navigate("/skill-gap")}

                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"

                    >

                        Skill Gap

                    </button>


                    {/* Interview Prep */}

                    <button

                        onClick={() => navigate("/interview-prep")}

                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"

                    >

                        Interview Prep

                    </button>


                </nav>

            </aside>


            {/* =================================================
                Main Content
            ================================================= */}

            <main className="flex-1">


                {/* =================================================
                    Header
                ================================================= */}

                <header className="bg-white border-b px-8 py-5 flex justify-between items-center">


                    <div>

                        <h2 className="text-xl font-semibold text-gray-800">

                            Dashboard

                        </h2>


                        <p className="text-sm text-gray-500">

                            Manage your job search in one place

                        </p>

                    </div>


                    <div className="flex items-center gap-4">


                        <div className="text-right">

                            <p className="font-medium text-gray-800">

                                {user.email}

                            </p>


                            <p className="text-sm text-gray-500">

                                Job Seeker

                            </p>

                        </div>


                        {/* Logout */}

                        <button

                            onClick={handleLogout}

                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"

                        >

                            Logout

                        </button>


                    </div>

                </header>


                {/* =================================================
                    Dashboard Content
                ================================================= */}

                <section className="p-8">


                    {/* Welcome */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-900">

                            Welcome back 👋

                        </h1>


                        <p className="text-gray-500 mt-2">

                            Let's improve your chances of landing your next job.

                        </p>

                    </div>


                    {/* =================================================
                        Statistics
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


                        {/* Resume Score */}

                        <div className="bg-white p-6 rounded-xl shadow-sm border">

                            <p className="text-sm text-gray-500">

                                Resume Score

                            </p>


                            <h2 className="text-3xl font-bold mt-2">

                                {resumeScore !== null
                                    ? `${resumeScore}/100`
                                    : "--"
                                }

                            </h2>


                            <p className="text-sm text-gray-400 mt-2">

                                {resumeScore !== null
                                    ? "Latest resume analysis"
                                    : "Upload a resume to analyze"
                                }

                            </p>

                        </div>


                        {/* Jobs Analyzed */}

                        <div className="bg-white p-6 rounded-xl shadow-sm border">

                            <p className="text-sm text-gray-500">

                                Jobs Analyzed

                            </p>


                            <h2 className="text-3xl font-bold mt-2">

                                {jobCount}

                            </h2>


                            <p className="text-sm text-gray-400 mt-2">

                                Start analyzing job descriptions

                            </p>

                        </div>


                        {/* Applications */}

                        <div className="bg-white p-6 rounded-xl shadow-sm border">

                            <p className="text-sm text-gray-500">

                                Applications

                            </p>


                            <h2 className="text-3xl font-bold mt-2">

                                {applicationCount}

                            </h2>


                            <p className="text-sm text-gray-400 mt-2">

                                Applications tracked

                            </p>

                        </div>


                        {/* Interviews */}

                        <div className="bg-white p-6 rounded-xl shadow-sm border">

                            <p className="text-sm text-gray-500">

                                Interviews

                            </p>


                            <h2 className="text-3xl font-bold mt-2">

                                0

                            </h2>


                            <p className="text-sm text-gray-400 mt-2">

                                Practice interview questions

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        Quick Actions
                    ================================================= */}

                    <h2 className="text-xl font-semibold mb-5">

                        Quick Actions

                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


                        {/* Analyze Resume */}

                        <button

                            onClick={() => navigate("/resume-analyzer")}

                            className="bg-white p-6 rounded-xl border shadow-sm text-left hover:shadow-md transition"

                        >

                            <div className="text-3xl mb-4">

                                📄

                            </div>


                            <h3 className="font-semibold text-lg">

                                Analyze Resume

                            </h3>


                            <p className="text-sm text-gray-500 mt-2">

                                Check your resume score and identify improvements.

                            </p>

                        </button>


                        {/* Analyze Job */}

                        <button

                            onClick={() => navigate("/job-analyzer")}

                            className="bg-white p-6 rounded-xl border shadow-sm text-left hover:shadow-md transition"

                        >

                            <div className="text-3xl mb-4">

                                💼

                            </div>


                            <h3 className="font-semibold text-lg">

                                Analyze Job

                            </h3>


                            <p className="text-sm text-gray-500 mt-2">

                                Compare your skills with a job description.

                            </p>

                        </button>


                        {/* Track Application */}

                        <button

                            onClick={() => navigate("/applications")}

                            className="bg-white p-6 rounded-xl border shadow-sm text-left hover:shadow-md transition"

                        >

                            <div className="text-3xl mb-4">

                                📊

                            </div>


                            <h3 className="font-semibold text-lg">

                                Track Application

                            </h3>


                            <p className="text-sm text-gray-500 mt-2">

                                Keep track of your job applications.

                            </p>

                        </button>


                        {/* Practice Interview */}

                        <button

                            onClick={() => navigate("/interview-prep")}

                            className="bg-white p-6 rounded-xl border shadow-sm text-left hover:shadow-md transition"

                        >

                            <div className="text-3xl mb-4">

                                🎯

                            </div>


                            <h3 className="font-semibold text-lg">

                                Practice Interview

                            </h3>


                            <p className="text-sm text-gray-500 mt-2">

                                Prepare for technical and HR interviews.

                            </p>

                        </button>


                    </div>


                </section>

            </main>

        </div>

    );
}

export default Dashboard;
