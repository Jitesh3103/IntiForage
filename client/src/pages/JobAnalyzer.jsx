import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JobAnalyzer() {
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");

    const [skills, setSkills] = useState([]);
    const [wordCount, setWordCount] = useState(0);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const skillList = [
        "javascript",
        "react",
        "node.js",
        "express",
        "python",
        "java",
        "c",
        "sql",
        "mysql",
        "mongodb",
        "git",
        "github",
        "html",
        "css",
        "power bi",
        "tableau",
        "machine learning",
        "data science",
        "data analysis",
        "restful api",
        "typescript",
        "angular",
        "next.js",
        "docker",
        "aws",
        "azure",
        "kubernetes",
        "figma",
        "pandas",
        "numpy"
    ];

    const analyzeJob = async () => {
        setError("");
        setMessage("");

        if (!jobDescription.trim()) {
            setError("Please enter a job description.");
            return;
        }

        const words = jobDescription
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        const detectedSkills = skillList.filter((skill) =>
            jobDescription
                .toLowerCase()
                .includes(skill.toLowerCase())
        );

        setWordCount(words.length);
        setSkills(detectedSkills);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login again.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/jobs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        jobTitle,
                        company,
                        jobDescription,
                        detectedSkills: detectedSkills.join(", ")
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save job analysis"
                );
            }

            setMessage("Job analysis saved successfully.");

        } catch (error) {
            console.error("Job analysis error:", error);

            setError(
                error.message || "Something went wrong."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}

            <header className="bg-white border-b px-8 py-5">

                <div className="max-w-5xl mx-auto flex justify-between items-center">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Job Analyzer
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Analyze a job description and identify the required skills.
                        </p>

                    </div>

                     <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

                </div>

            </header>


            {/* Main Content */}

            <main className="p-8">

                <div className="max-w-5xl mx-auto">

                    {/* Input Card */}

                    <div className="bg-white rounded-xl shadow-sm border p-6">

                        {/* Job Title */}

                        <div className="mb-5">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) =>
                                    setJobTitle(e.target.value)
                                }
                                placeholder="Example: Software Engineer"
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Company */}

                        <div className="mb-5">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company
                            </label>

                            <input
                                type="text"
                                value={company}
                                onChange={(e) =>
                                    setCompany(e.target.value)
                                }
                                placeholder="Example: Google"
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* Job Description */}

                        <div className="mb-5">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>

                            <textarea
                                value={jobDescription}
                                onChange={(e) =>
                                    setJobDescription(e.target.value)
                                }
                                placeholder="Paste the job description here..."
                                rows="12"
                                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />

                        </div>


                        {/* Analyze Button */}

                        <button
                            onClick={analyzeJob}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Analyzing..."
                                : "Analyze Job"}
                        </button>


                        {/* Success Message */}

                        {message && (
                            <p className="mt-4 text-green-600">
                                {message}
                            </p>
                        )}


                        {/* Error Message */}

                        {error && (
                            <p className="mt-4 text-red-600">
                                {error}
                            </p>
                        )}

                    </div>


                    {/* Results */}

                    {wordCount > 0 && (

                        <div className="mt-8">

                            <h2 className="text-xl font-semibold mb-5">
                                Analysis Results
                            </h2>


                            {/* Statistics */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Word Count */}

                                <div className="bg-white p-6 rounded-xl border shadow-sm">

                                    <p className="text-sm text-gray-500">
                                        Word Count
                                    </p>

                                    <h3 className="text-3xl font-bold mt-2">
                                        {wordCount}
                                    </h3>

                                </div>


                                {/* Skills Count */}

                                <div className="bg-white p-6 rounded-xl border shadow-sm">

                                    <p className="text-sm text-gray-500">
                                        Skills Detected
                                    </p>

                                    <h3 className="text-3xl font-bold mt-2">
                                        {skills.length}
                                    </h3>

                                </div>

                            </div>


                            {/* Detected Skills */}

                            <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">

                                <h3 className="font-semibold text-lg mb-4">
                                    Required Skills
                                </h3>

                                {skills.length > 0 ? (

                                    <div className="flex flex-wrap gap-2">

                                        {skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}

                                    </div>

                                ) : (

                                    <p className="text-gray-500">
                                        No matching skills detected.
                                    </p>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default JobAnalyzer;