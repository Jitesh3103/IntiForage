const express = require("express");

const {
    generateAptitudeQuestions
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/aptitude",
    authMiddleware,
    generateAptitudeQuestions
);

module.exports = router;