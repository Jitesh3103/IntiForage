import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">

                <h1 className="text-2xl font-bold text-blue-600">
                    IntiForage
                </h1>

                <div className="flex gap-4">

                    <Link
                        to="/login"
                        className="px-5 py-2 text-blue-600 font-medium"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Get Started
                    </Link>

                </div>

            </nav>


            {/* Hero Section */}
            <section className="flex flex-col items-center text-center px-6 py-24">

                <h2 className="text-5xl font-bold max-w-3xl leading-tight">

                    Build Your Career with

                    <span className="text-blue-600">
                        {" "}IntiForage
                    </span>

                </h2>

                <p className="mt-6 text-lg text-gray-600 max-w-2xl">

                    An AI-powered career platform that helps you analyze your
                    resume, understand job requirements, identify skill gaps,
                    track applications, and prepare for interviews.

                </p>


                <div className="flex gap-4 mt-8">

                    <Link
                        to="/register"
                        className="px-7 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="px-7 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100"
                    >
                        Login
                    </Link>

                </div>

            </section>


            {/* Features */}
            <section className="px-8 py-16 bg-white">

                <h3 className="text-3xl font-bold text-center mb-12">
                    Everything You Need for Your Career
                </h3>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    <Feature
                        title="Resume Analyzer"
                        description="Analyze your resume and identify important skills and sections."
                    />

                    <Feature
                        title="Job Analyzer"
                        description="Understand job descriptions and discover the skills employers are looking for."
                    />

                    <Feature
                        title="Skill Gap"
                        description="Compare your current skills with your target job requirements."
                    />

                    <Feature
                        title="Interview Preparation"
                        description="Practice aptitude, coding, technical, HR and company interview questions."
                    />

                    <Feature
                        title="Application Tracker"
                        description="Keep track of your job applications and their current status."
                    />

                    <Feature
                        title="AI Career Support"
                        description="Use AI-powered tools to prepare better and make smarter career decisions."
                    />

                </div>

            </section>


            {/* Footer */}
            <footer className="text-center py-6 bg-gray-900 text-gray-400">

                © 2026 IntiForage. All rights reserved.

            </footer>

        </div>
    );
}


function Feature({ title, description }) {
    return (
        <div className="p-6 border rounded-xl bg-gray-50 hover:shadow-md transition">

            <h4 className="text-xl font-semibold mb-3">
                {title}
            </h4>

            <p className="text-gray-600">
                {description}
            </p>

        </div>
    );
}


export default Home;