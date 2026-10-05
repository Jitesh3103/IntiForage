const express = require("express");

const {
    createJobAnalysis,
    getJobAnalyses
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Save job analysis
router.post(
    "/",
    authMiddleware,
    createJobAnalysis
);


// Get user's job analyses
router.get(
    "/",
    authMiddleware,
    getJobAnalyses
);


module.exports = router;