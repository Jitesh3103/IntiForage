import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobAnalyzer from "./pages/JobAnalyzer";
import SkillGap from "./pages/SkillGap";
import Applications from "./pages/Applications";

import InterviewPrep from "./pages/InterviewPrep";
import Aptitude from "./pages/Aptitude";
import Coding from "./pages/Coding";
import TechnicalTheory from "./pages/TechnicalTheory";
import ResumeQuestions from "./pages/ResumeQuestions";

import InterviewRound from "./pages/InterviewRound";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Landing Page */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Authentication */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Main Features */}
                <Route
                    path="/resume-analyzer"
                    element={<ResumeAnalyzer />}
                />

                <Route
                    path="/job-analyzer"
                    element={<JobAnalyzer />}
                />

                <Route
                    path="/skill-gap"
                    element={<SkillGap />}
                />

                <Route
                    path="/applications"
                    element={<Applications />}
                />

                {/* Interview Preparation */}
                <Route
                    path="/interview-prep"
                    element={<InterviewPrep />}
                />

                <Route
                    path="/resume-questions"
                    element={<ResumeQuestions />}
                />

                <Route
                    path="/aptitude"
                    element={<Aptitude />}
                />

                <Route
                    path="/coding"
                    element={<Coding />}
                />

                <Route
                    path="/technical-theory"
                    element={<TechnicalTheory />}
                />

                {/* Company / Manager / HR */}
                <Route
                    path="/company-round"
                    element={<InterviewRound round="company" />}
                />

                <Route
                    path="/manager-round"
                    element={<InterviewRound round="manager" />}
                />

                <Route
                    path="/hr-round"
                    element={<InterviewRound round="hr" />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
