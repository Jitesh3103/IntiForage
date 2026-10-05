import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumeAnalyzer() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && selectedFile.type !== "application/pdf") {
            setError("Please select a PDF file.");
            setFile(null);
            return;
        }

        setError("");
        setFile(selectedFile);
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError("Please select a resume first.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("resume", file);

            const response = await fetch(
                "http://localhost:5000/api/resume/analyze",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to analyze resume");
            }

            setResult(data.analysis);
        } catch (error) {
            console.error("Resume analysis error:", error);
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Resume Analyzer
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Analyze your resume and identify areas for improvement
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

                {/* Upload Section */}
                <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Upload Your Resume
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Upload your resume in PDF format to analyze its structure,
                        skills and overall quality.
                    </p>

                    <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">

                        <div className="text-5xl mb-4">
                            📄
                        </div>

                        <p className="text-gray-700 font-medium">
                            {file ? file.name : "Select your resume PDF"}
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                            PDF files only
                        </p>

                        <label className="inline-block mt-5 cursor-pointer">
                            <span className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Choose Resume
                            </span>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {file && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="ml-3 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                            >
                                {loading ? "Analyzing..." : "Analyze Resume"}
                            </button>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm mt-5">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <div>

                        {/* Score */}
                        <div className="bg-white rounded-xl border shadow-sm p-8 mb-8 text-center">

                            <p className="text-gray-500">
                                Resume Score
                            </p>

                            <div className="text-6xl font-bold text-blue-600 mt-3">
                                {result.score}
                                <span className="text-2xl text-gray-400">
                                    /100
                                </span>
                            </div>

                            <p className="text-gray-500 mt-3">
                                Based on resume structure, skills and content
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-sm text-gray-500">
                                    Word Count
                                </p>
                                <h3 className="text-3xl font-bold mt-2">
                                    {result.wordCount}
                                </h3>
                            </div>

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-sm text-gray-500">
                                    Skills Detected
                                </p>
                                <h3 className="text-3xl font-bold mt-2">
                                    {result.detectedSkills.length}
                                </h3>
                            </div>

                            <div className="bg-white rounded-xl border shadow-sm p-6">
                                <p className="text-sm text-gray-500">
                                    Sections Detected
                                </p>
                                <h3 className="text-3xl font-bold mt-2">
                                    {result.detectedSections.length}
                                </h3>
                            </div>

                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">

                            <h2 className="text-xl font-semibold">
                                Detected Skills
                            </h2>

                            <div className="flex flex-wrap gap-3 mt-5">

                                {result.detectedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}

                            </div>

                        </div>

                        {/* Sections */}
                        <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">

                            <h2 className="text-xl font-semibold">
                                Resume Sections
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                                {result.detectedSections.map((section) => (
                                    <div
                                        key={section}
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-green-600 font-bold">
                                            ✓
                                        </span>

                                        <span className="capitalize text-gray-700">
                                            {section}
                                        </span>
                                    </div>
                                ))}

                            </div>

                        </div>

                        {/* Suggestions */}
                        <div className="bg-white rounded-xl border shadow-sm p-8">

                            <h2 className="text-xl font-semibold">
                                Suggestions
                            </h2>

                            {result.suggestions.length === 0 ? (
                                <div className="mt-5 p-4 bg-green-50 text-green-700 rounded-lg">
                                    ✓ No major issues detected in the current analysis.
                                </div>
                            ) : (
                                <div className="mt-5 space-y-3">
                                    {result.suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-yellow-50 text-yellow-800 rounded-lg"
                                        >
                                            • {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}

export default ResumeAnalyzer;