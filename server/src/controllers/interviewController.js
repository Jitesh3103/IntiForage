const pool = require("../config/db");


// ============================================================
// GENERATE GENERAL INTERVIEW QUESTIONS
// ============================================================

const generateQuestions = async (req, res) => {
    try {

        const {
            category,
            subcategory,
            difficulty = "Medium",
            jobRole
        } = req.body;


        if (!category) {
            return res.status(400).json({
                message: "Category is required"
            });
        }


        const result = await pool.query(
            `SELECT *
             FROM interview_questions
             WHERE category = $1
             AND ($2::VARCHAR IS NULL OR subcategory = $2)
             AND ($3::VARCHAR IS NULL OR difficulty = $3)
             AND ($4::VARCHAR IS NULL OR job_role = $4)
             ORDER BY RANDOM()
             LIMIT 10`,
            [
                category,
                subcategory || null,
                difficulty || null,
                jobRole || null
            ]
        );


        res.json({
            message: "Questions fetched successfully",
            questions: result.rows
        });


    } catch (error) {

        console.error(
            "Interview question error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch interview questions"
        });

    }
};


// ============================================================
// GENERATE RESUME QUESTIONS
// ============================================================

const generateResumeQuestions = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM resumes
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [req.user.id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message:
                    "Please upload and analyze your resume first"
            });

        }


        const resume = result.rows[0];


        let extractedData =
            resume.extracted_data || {};


        if (typeof extractedData === "string") {

            try {
                extractedData =
                    JSON.parse(extractedData);
            } catch (error) {
                extractedData = {};
            }

        }


        const summary =
            Array.isArray(extractedData.summary)
                ? extractedData.summary
                : [];


        const education =
            Array.isArray(extractedData.education)
                ? extractedData.education
                : [];


        const experience =
            Array.isArray(extractedData.experience)
                ? extractedData.experience
                : [];


        const projects =
            Array.isArray(extractedData.projects)
                ? extractedData.projects
                : [];


        const skills =
            Array.isArray(extractedData.skills)
                ? extractedData.skills
                : [];


        const certifications =
            Array.isArray(extractedData.certifications)
                ? extractedData.certifications
                : [];


        const questions = [];


        const addQuestion = (
            question,
            type,
            minWords = 40,
            maxWords = 80
        ) => {

            questions.push({
                question,
                type,
                expected_min_words: minWords,
                expected_max_words: maxWords
            });

        };


        // Introduction

        addQuestion(
            "Tell me about yourself and walk me through the most important parts of your resume.",
            "Introduction",
            60,
            100
        );


        // Summary

        if (summary.length > 0) {

            addQuestion(
                "Your resume contains a professional summary. Explain the key points from your summary and how they represent your strengths.",
                "Summary",
                50,
                90
            );

        }


        // Education

        if (education.length > 0) {

            addQuestion(
                "Walk me through your educational background and explain how it prepared you for your target career.",
                "Education",
                50,
                90
            );

            addQuestion(
                "What subjects, coursework or areas of study from your education are most relevant to the role you are applying for?",
                "Education",
                50,
                90
            );

        }


        // Experience

        if (experience.length > 0) {

            addQuestion(
                "Walk me through your professional experience or internships mentioned on your resume.",
                "Experience",
                60,
                100
            );

            addQuestion(
                "What were your main responsibilities in your most recent experience?",
                "Experience",
                50,
                90
            );

            addQuestion(
                "What was the most challenging task you handled during your professional experience?",
                "Experience",
                50,
                90
            );

            addQuestion(
                "What did you learn from your professional experience that you can apply to your next role?",
                "Experience",
                50,
                90
            );

            addQuestion(
                "Describe a problem you faced during your experience and explain how you solved it.",
                "Experience",
                50,
                100
            );

        }


        // Skills

        if (skills.length > 0) {

            const uniqueSkills = [
                ...new Set(
                    skills.map(skill =>
                        String(skill).trim()
                    )
                )
            ];


            uniqueSkills
                .slice(0, 5)
                .forEach(skill => {

                    addQuestion(
                        `You have mentioned ${skill} on your resume. Explain your experience with ${skill} and where you have used it.`,
                        "Technical Skill",
                        40,
                        80
                    );

                });


            addQuestion(
                "Which technical skill on your resume are you strongest in, and how have you demonstrated that skill through your work or projects?",
                "Technical Skill",
                50,
                90
            );


            addQuestion(
                "Which skill mentioned on your resume would you like to improve further, and how are you planning to improve it?",
                "Technical Skill",
                40,
                80
            );

        }


        // Projects

        if (projects.length > 0) {

            addQuestion(
                "Walk me through the projects mentioned on your resume and explain which one you are most confident discussing.",
                "Project",
                60,
                110
            );

            addQuestion(
                "Explain one of your projects from start to finish, including the problem, solution, technologies used and your contribution.",
                "Project",
                70,
                120
            );

            addQuestion(
                "What was the most difficult technical challenge you faced while building one of your projects, and how did you solve it?",
                "Project",
                50,
                100
            );

            addQuestion(
                "What would you improve or change if you had more time to develop one of your projects?",
                "Project",
                40,
                80
            );

            addQuestion(
                "How did you test and debug one of the projects mentioned on your resume?",
                "Project",
                40,
                80
            );

        }


        // Certifications

        if (certifications.length > 0) {

            addQuestion(
                "Which certification or course mentioned on your resume has contributed most to your technical growth?",
                "Certification",
                40,
                80
            );

            addQuestion(
                "What practical knowledge did you gain from the certifications or courses listed on your resume?",
                "Certification",
                40,
                80
            );

        }


        // Follow-up

        addQuestion(
            "Which part of your resume best demonstrates your ability to solve real-world problems?",
            "Follow-up",
            40,
            80
        );


        addQuestion(
            "What is one thing on your resume that you would like an interviewer to ask you about?",
            "Follow-up",
            40,
            80
        );


        addQuestion(
            "Looking at your resume as a whole, what are your strongest areas and what areas do you still want to improve?",
            "Follow-up",
            50,
            90
        );


        const uniqueQuestions =
            questions.filter(
                (question, index, self) =>
                    index ===
                    self.findIndex(
                        item =>
                            item.question ===
                            question.question
                    )
            );


        const shuffledQuestions =
            [...uniqueQuestions]
                .sort(() => Math.random() - 0.5)
                .slice(0, 10);


        res.json({

            message:
                "Resume questions generated successfully",

            resume: {
                id: resume.id,
                filename: resume.filename
            },

            questions:
                shuffledQuestions

        });


    } catch (error) {

        console.error(
            "Resume question error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to generate resume questions"
        });

    }

};


// ============================================================
// COMPANY / MANAGER / HR ROUND
// ============================================================

const generateRoundQuestions = async (req, res) => {

    try {

        const round =
            String(req.params.round || "")
                .toLowerCase();


        const validRounds = [
            "company",
            "manager",
            "hr"
        ];


        if (!validRounds.includes(round)) {

            return res.status(400).json({
                message:
                    "Invalid interview round"
            });

        }


        // ====================================================
        // GET LATEST JOB
        // ====================================================

        const jobResult = await pool.query(
            `SELECT *
             FROM job_analyses
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [req.user.id]
        );


        if (jobResult.rows.length === 0) {

            return res.status(404).json({
                message:
                    "Please analyze a job description first"
            });

        }


        const job = jobResult.rows[0];


        // ====================================================
        // GET LATEST RESUME
        // ====================================================

        const resumeResult = await pool.query(
            `SELECT *
             FROM resumes
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [req.user.id]
        );


        let resume = null;
        let extractedData = {};


        if (resumeResult.rows.length > 0) {

            resume =
                resumeResult.rows[0];


            extractedData =
                resume.extracted_data || {};


            if (
                typeof extractedData ===
                "string"
            ) {

                try {

                    extractedData =
                        JSON.parse(
                            extractedData
                        );

                } catch (error) {

                    extractedData = {};

                }

            }

        }


        // ====================================================
        // JOB INFORMATION
        // ====================================================

        const company =
            job.company ||
            "the organization";


        const jobTitle =
            job.job_title ||
            "this role";


        const jobDescription =
            job.job_description ||
            "";


        const detectedSkills =
            job.detected_skills ||
            "";


        // ====================================================
        // RESUME INFORMATION
        // ====================================================

        const resumeSkills =
            Array.isArray(
                extractedData.skills
            )
                ? extractedData.skills
                : [];


        const experience =
            Array.isArray(
                extractedData.experience
            )
                ? extractedData.experience
                : [];


        const projects =
            Array.isArray(
                extractedData.projects
            )
                ? extractedData.projects
                : [];


        const education =
            Array.isArray(
                extractedData.education
            )
                ? extractedData.education
                : [];


        // ====================================================
        // QUESTION ARRAY
        // ====================================================

        const questions = [];


        const addQuestion = (
            question,
            type,
            minWords = 40,
            maxWords = 80
        ) => {

            questions.push({

                question,

                type,

                expected_min_words:
                    minWords,

                expected_max_words:
                    maxWords

            });

        };


        // ====================================================
        // COMPANY ROUND
        // ====================================================

        if (round === "company") {

            addQuestion(
                `Why do you want to join ${company}?`,
                "Company",
                40,
                80
            );


            addQuestion(
                `What do you know about ${company} and why are you interested in working there?`,
                "Company",
                50,
                90
            );


            addQuestion(
                `Why are you interested in the ${jobTitle} role at ${company}?`,
                "Role",
                40,
                80
            );


            addQuestion(
                `Why do you think you are a good fit for the ${jobTitle} position?`,
                "Role",
                50,
                90
            );


            addQuestion(
                "What value do you think you could bring to the organization?",
                "Company",
                40,
                80
            );


            addQuestion(
                "What interests you most about this opportunity?",
                "Career",
                40,
                80
            );


            if (jobDescription.trim()) {

                addQuestion(
                    `Which responsibilities mentioned in the ${jobTitle} job description are you most prepared to handle?`,
                    "Job Description",
                    50,
                    100
                );


                addQuestion(
                    "Which requirement in the job description would be the biggest learning opportunity for you?",
                    "Job Description",
                    50,
                    100
                );

            }


            if (detectedSkills.trim()) {

                addQuestion(
                    `The job description mentions these skills: ${detectedSkills}. Which of these are your strongest and how have you used them?`,
                    "Technical Skills",
                    50,
                    100
                );

            }

        }


        // ====================================================
        // MANAGER ROUND
        // ====================================================

        if (round === "manager") {

            addQuestion(
                "Tell me about a situation where you had to take ownership of a task.",
                "Ownership",
                50,
                90
            );


            addQuestion(
                "Describe a difficult problem you faced and how you approached solving it.",
                "Problem Solving",
                50,
                100
            );


            addQuestion(
                "Tell me about a time when you had to learn something quickly to complete a task.",
                "Learning",
                50,
                90
            );


            addQuestion(
                "How do you prioritize your work when you have multiple tasks with similar deadlines?",
                "Prioritization",
                50,
                90
            );


            addQuestion(
                "Describe a situation where you disagreed with a teammate. How did you handle it?",
                "Teamwork",
                50,
                100
            );


            addQuestion(
                "Tell me about a mistake you made while working on a project and what you learned from it.",
                "Accountability",
                50,
                90
            );


            addQuestion(
                "How do you handle feedback from a senior or manager?",
                "Communication",
                40,
                80
            );


            addQuestion(
                `How would you contribute to a team working on ${jobTitle} responsibilities?`,
                "Teamwork",
                50,
                90
            );


            if (experience.length > 0) {

                addQuestion(
                    "Tell me about a situation from your previous experience where you had to solve a problem independently.",
                    "Experience",
                    50,
                    100
                );

            }


            if (projects.length > 0) {

                addQuestion(
                    "Describe a project where you had to make an important technical or design decision.",
                    "Project",
                    50,
                    100
                );

            }

        }


        // ====================================================
        // HR / BEHAVIORAL ROUND
        // ====================================================

        if (round === "hr") {

            addQuestion(
                "Tell me about yourself.",
                "Introduction",
                50,
                90
            );


            addQuestion(
                "Why are you interested in this role?",
                "Motivation",
                40,
                80
            );


            addQuestion(
                "What are your biggest strengths?",
                "Strengths",
                40,
                70
            );


            addQuestion(
                "What is one weakness or area you are currently working to improve?",
                "Weakness",
                40,
                80
            );


            addQuestion(
                "Where do you see yourself in the next three to five years?",
                "Career",
                40,
                80
            );


            addQuestion(
                "Why should we hire you?",
                "Motivation",
                40,
                80
            );


            addQuestion(
                "How do you handle pressure or tight deadlines?",
                "Behavioral",
                40,
                80
            );


            addQuestion(
                "Tell me about a time when you worked successfully as part of a team.",
                "Teamwork",
                50,
                90
            );


            addQuestion(
                "Tell me about a failure or setback and what you learned from it.",
                "Behavioral",
                50,
                90
            );


            addQuestion(
                "How do you handle criticism or constructive feedback?",
                "Behavioral",
                40,
                80
            );


            addQuestion(
                "What motivates you to perform well at work?",
                "Motivation",
                40,
                80
            );


            addQuestion(
                `Why do you want to build your career in the ${jobTitle} field?`,
                "Career",
                40,
                80
            );


            if (education.length > 0) {

                addQuestion(
                    "How has your educational background influenced your career goals?",
                    "Education",
                    40,
                    80
                );

            }


            if (experience.length > 0) {

                addQuestion(
                    "What is the most important lesson you learned from your previous experience?",
                    "Experience",
                    40,
                    80
                );

            }


            if (projects.length > 0) {

                addQuestion(
                    "Which project are you most proud of and why?",
                    "Project",
                    40,
                    80
                );

            }


            if (resumeSkills.length > 0) {

                addQuestion(
                    `Which skill from your resume do you think will help you most in your career?`,
                    "Skills",
                    40,
                    80
                );

            }

        }


        // ====================================================
        // REMOVE DUPLICATES
        // ====================================================

        const uniqueQuestions =
            questions.filter(
                (question, index, self) =>
                    index ===
                    self.findIndex(
                        item =>
                            item.question ===
                            question.question
                    )
            );


        // ====================================================
        // SHUFFLE
        // ====================================================

        const shuffledQuestions =
            [...uniqueQuestions]
                .sort(
                    () =>
                        Math.random() - 0.5
                )
                .slice(0, 10);


        // ====================================================
        // RESPONSE
        // ====================================================

        res.json({

            message:
                `${round} round questions generated successfully`,

            round,

            job: {

                company:
                    job.company,

                job_title:
                    job.job_title

            },

            questions:
                shuffledQuestions

        });


    } catch (error) {

        console.error(
            "Interview round error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to generate interview round questions"

        });

    }

};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    generateQuestions,

    generateResumeQuestions,

    generateRoundQuestions

};