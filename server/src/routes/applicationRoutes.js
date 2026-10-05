const express = require("express");

const {
    getApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getApplications
);

router.post(
    "/",
    authMiddleware,
    createApplication
);

router.put(
    "/:id/status",
    authMiddleware,
    updateApplicationStatus
);

router.delete(
    "/:id",
    authMiddleware,
    deleteApplication
);

module.exports = router;