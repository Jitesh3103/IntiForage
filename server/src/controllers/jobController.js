const pool = require("../config/db");

// Save a job analysis
const createJobAnalysis = async (req, res) => {
    try {
        const {
            jobTitle,
            company,
            jobDescription,
            detectedSkills
        } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO job_analyses
            (user_id, job_title, company, job_description, detected_skills)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                req.user.id,
                jobTitle || null,
                company || null,
                jobDescription,
                detectedSkills || ""
            ]
        );

        res.status(201).json({
            message: "Job analysis saved successfully",
            analysis: result.rows[0]
        });

    } catch (error) {
        console.error("Create job analysis error:", error);

        res.status(500).json({
            message: "Failed to save job analysis"
        });
    }
};


// Get all job analyses for logged-in user
const getJobAnalyses = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM job_analyses
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json({
            analyses: result.rows
        });

    } catch (error) {
        console.error("Get job analyses error:", error);

        res.status(500).json({
            message: "Failed to fetch job analyses"
        });
    }
};


module.exports = {
    createJobAnalysis,
    getJobAnalyses
};