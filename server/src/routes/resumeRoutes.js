const express = require("express");
const multer = require("multer");

const {
    analyzeResume,
    getLatestResume
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});


// Analyze uploaded resume
router.post(
    "/analyze",
    authMiddleware,
    upload.single("resume"),
    analyzeResume
);


// Get latest resume of logged-in user
router.get(
    "/latest",
    authMiddleware,
    getLatestResume
);


module.exports = router;