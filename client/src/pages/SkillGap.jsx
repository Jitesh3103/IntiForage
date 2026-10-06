import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SkillGap() {
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState("");
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const skills = [
        "javascript",
        "react",
        "node.js",
        "express",
        "python",
        "java",
        "c",
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "git",
        "github",
        "html",
        "css",
        "typescript",
        "docker",
        "aws",
        "power bi",
        "tableau",
        "machine learning",
        "data science",
        "data analysis",
        "rest api",
        "restful api"
    ];

    // Load latest saved job analysis
    useEffect(() => {
        const fetchLatestJob = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    "https://intiforage-backend.onrender.com/api/jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Failed to load job analysis."
                    );
                    return;
                }

                if (!data.analyses || data.analyses.length === 0) {
                    setError(
                        "Please analyze a job description first."
                    );
                    return;
                }

                // Latest analysis is first because backend sorts by created_at DESC
                const latestJob = data.analyses[0];

                setJobDescription(latestJob.job_description || "");
            } catch (error) {
                console.error("Load job analysis error:", error);

                setError(
                    "Unable to connect to the server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLatestJob();
    }, [navigate]);

    // Load latest saved resume analysis
    useEffect(() => {
        const fetchLatestResume = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    "https://intiforage-backend.onrender.com/api/resume/latest",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Failed to load resume analysis."
                    );
                    return;
                }

                if (!data.resume || !data.resume.analysis) {
                    setError("Please analyze your resume first.");
                    return;
                }

                setResumeAnalysis(data.resume.analysis);
            } catch (error) {
                console.error("Load resume analysis error:", error);

                setError(
                    "Unable to connect to the server."
                );
            }
        };

        fetchLatestResume();
    }, [navigate]);

    const analyzeSkillGap = () => {
        if (!jobDescription.trim()) {
            setError("Please analyze a job description first.");
            return;
        }

        if (!resumeAnalysis) {
            setError("Please analyze your resume first.");
            return;
        }

        const resumeSkills = resumeAnalysis.detectedSkills.map((skill) =>
            skill.toLowerCase()
        );

        const lowerJobDescription = jobDescription.toLowerCase();

        const requiredSkills = skills.filter((skill) =>
            lowerJobDescription.includes(skill)
        );

        const matchingSkills = requiredSkills.filter((skill) =>
            resumeSkills.includes(skill)
        );

        const missingSkills = requiredSkills.filter(
            (skill) => !resumeSkills.includes(skill)
        );

        const matchPercentage =
            requiredSkills.length > 0
                ? Math.round(
                      (matchingSkills.length / requiredSkills.length) * 100
                  )
                : 0;

        setResult({
            requiredSkills,
            matchingSkills,
            missingSkills,
            matchPercentage
        });

        setError("");
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Skill Gap Analysis
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Compare your resume skills with the latest analyzed job
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="max-w-6xl mx-auto p-8">

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                        <p className="text-gray-500">
                            Loading latest job analysis...
                        </p>
                    </div>
                )}

                {/* Job Description */}
                {!loading && (
                    <div className="bg-white rounded-xl border shadow-sm p-8">

                        <h2 className="text-xl font-semibold">
                            Latest Job Description
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your latest analyzed job description is loaded
                            automatically.
                        </p>

                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            className="w-full h-64 mt-6 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {error && (
                            <p className="text-red-500 text-sm mt-3">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={analyzeSkillGap}
                            className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Analyze Skill Gap
                        </button>

                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="mt-8">

                        {/* Match Score */}
                        <div className="bg-white rounded-xl border shadow-sm p-8 text-center">

                            <p className="text-gray-500">
                                Skill Match
                            </p>

                            <h2 className="text-6xl font-bold text-blue-600 mt-3">
                                {result.matchPercentage}%
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Based on detected resume and job skills
                            </p>

                        </div>

                        {/* Matching Skills */}
                        <div className="bg-white rounded-xl border shadow-sm p-8 mt-6">

                            <h2 className="text-xl font-semibold">
                                Matching Skills
                            </h2>

                            {result.matchingSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-3 mt-5">

                                    {result.matchingSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                                        >
                                            ✓ {skill}
                                        </span>
                                    ))}

                                </div>
                            ) : (
                                <p className="text-gray-500 mt-5">
                                    No matching skills detected.
                                </p>
                            )}

                        </div>

                        {/* Missing Skills */}
                        <div className="bg-white rounded-xl border shadow-sm p-8 mt-6">

                            <h2 className="text-xl font-semibold">
                                Missing Skills
                            </h2>

                            {result.missingSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-3 mt-5">

                                    {result.missingSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                                        >
                                            ⚠ {skill}
                                        </span>
                                    ))}

                                </div>
                            ) : (
                                <p className="text-green-600 mt-5">
                                    ✓ No missing skills detected.
                                </p>
                            )}

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default SkillGap;