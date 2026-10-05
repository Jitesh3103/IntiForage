const express = require("express");

const {
    generateQuestions,
    generateResumeQuestions,
    generateRoundQuestions
} = require("../controllers/interviewController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// GENERAL INTERVIEW QUESTIONS
// ============================================================

router.post(
    "/questions",
    authMiddleware,
    generateQuestions
);


// ============================================================
// RESUME QUESTIONS
// ============================================================

router.post(
    "/resume-questions",
    authMiddleware,
    generateResumeQuestions
);


// ============================================================
// COMPANY / MANAGER / HR
// ============================================================

router.post(
    "/round/:round",
    authMiddleware,
    generateRoundQuestions
);


module.exports = router;