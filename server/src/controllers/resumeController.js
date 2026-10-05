const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const pool = require("../config/db");
const analyzeResumeText = require("../utils/resumeAnalyzer");


// =====================================================
// Analyze Resume
// =====================================================

const analyzeResume = async (req, res) => {
    let parser;

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a resume"
            });
        }

        const fileBuffer = fs.readFileSync(req.file.path);

        parser = new PDFParse({
            data: fileBuffer
        });

        const result = await parser.getText();

        const resumeText = result.text;

        // Analyze the uploaded resume
        const analysis = analyzeResumeText(resumeText);

        // Extract structured resume information
        const extractedData = analysis.extractedData || {};

        // Save resume information for the logged-in user
        await pool.query(
            `INSERT INTO resumes
            (
                user_id,
                filename,
                raw_text,
                extracted_data,
                analysis
            )
            VALUES ($1, $2, $3, $4, $5)`,
            [
                req.user.id,
                req.file.originalname,
                resumeText,
                JSON.stringify(extractedData),
                JSON.stringify(analysis)
            ]
        );

        res.status(200).json({
            message: "Resume analyzed successfully",

            resume: {
                filename: req.file.originalname,
                pages: result.total,
                text: resumeText
            },

            analysis: analysis,

            extractedData: extractedData
        });

    } catch (error) {
        console.error("Resume analysis error:", error);

        res.status(500).json({
            message: "Failed to analyze resume",
            error: error.message
        });

    } finally {

        if (parser) {
            await parser.destroy();
        }

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};


// =====================================================
// Get Latest Resume For Logged-In User
// =====================================================

const getLatestResume = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                id,
                filename,
                analysis,
                created_at
             FROM resumes
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [req.user.id]
        );

        // User has not uploaded a resume
        if (result.rows.length === 0) {
            return res.status(200).json({
                resume: null
            });
        }

        res.status(200).json({
            resume: result.rows[0]
        });

    } catch (error) {

        console.error("Get latest resume error:", error);

        res.status(500).json({
            message: "Failed to fetch latest resume",
            error: error.message
        });
    }
};


module.exports = {
    analyzeResume,
    getLatestResume
};