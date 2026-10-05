const pool = require("../config/db");

const getApplications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM applications
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            applications: result.rows
        });
    } catch (error) {
        console.error("Get applications error:", error);

        res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
};


const createApplication = async (req, res) => {
    try {
        const {
            company,
            jobTitle,
            location,
            status,
            appliedDate,
            notes
        } = req.body;

        if (!company || !jobTitle) {
            return res.status(400).json({
                message: "Company and job title are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO applications
            (user_id, company, job_title, location, status, applied_date, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                req.user.id,
                company,
                jobTitle,
                location || null,
                status || "Applied",
                appliedDate || null,
                notes || null
            ]
        );

        res.status(201).json({
            message: "Application created successfully",
            application: result.rows[0]
        });
    } catch (error) {
        console.error("Create application error:", error);

        res.status(500).json({
            message: "Failed to create application"
        });
    }
};


const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM applications
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application deleted successfully"
        });
    } catch (error) {
        console.error("Delete application error:", error);

        res.status(500).json({
            message: "Failed to delete application"
        });
    }
};
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Applied",
            "Interview",
            "Rejected",
            "Offer"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const result = await pool.query(
            `UPDATE applications
             SET status = $1
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [status, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application status updated successfully",
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Update application status error:", error);

        res.status(500).json({
            message: "Failed to update application status"
        });
    }
};


module.exports = {
    getApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication
};