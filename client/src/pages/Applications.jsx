import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Applications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        company: "",
        jobTitle: "",
        location: "",
        status: "Applied",
        appliedDate: "",
        notes: ""
    });

    const fetchApplications = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/applications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setApplications(data.applications);
        } catch (error) {
            console.error(error);
            setError("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "http://localhost:5000/api/applications",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setApplications([
                data.application,
                ...applications
            ]);

            setForm({
                company: "",
                jobTitle: "",
                location: "",
                status: "Applied",
                appliedDate: "",
                notes: ""
            });

        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to add application.");
        }
    };

    const handleStatusChange = async (id, status) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/applications/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setApplications(
                applications.map((application) =>
                    application.id === id
                        ? {
                            ...application,
                            status: data.application.status
                        }
                        : application
                )
            );

        } catch (error) {
            console.error(error);
            setError("Failed to update application status.");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/applications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setApplications(
                applications.filter(
                    (application) => application.id !== id
                )
            );

        } catch (error) {
            console.error(error);
            setError("Failed to delete application.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Application Tracker
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Track your job applications in one place
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="max-w-7xl mx-auto p-8">

                {/* Add Application */}
                <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">

                    <h2 className="text-xl font-semibold">
                        Add Application
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6"
                    >

                        <input
                            type="text"
                            name="company"
                            placeholder="Company *"
                            value={form.company}
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-lg"
                        />

                        <input
                            type="text"
                            name="jobTitle"
                            placeholder="Job Title *"
                            value={form.jobTitle}
                            onChange={handleChange}
                            required
                            className="p-3 border rounded-lg"
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Offer">Offer</option>
                        </select>

                        <input
                            type="date"
                            name="appliedDate"
                            value={form.appliedDate}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <input
                            type="text"
                            name="notes"
                            placeholder="Notes"
                            value={form.notes}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add Application
                        </button>

                    </form>

                    {error && (
                        <p className="text-red-500 text-sm mt-4">
                            {error}
                        </p>
                    )}

                </div>

                {/* Applications */}
                <div className="bg-white rounded-xl border shadow-sm p-8">

                    <h2 className="text-xl font-semibold">
                        My Applications
                    </h2>

                    {loading ? (
                        <p className="text-gray-500 mt-6">
                            Loading applications...
                        </p>
                    ) : applications.length === 0 ? (
                        <p className="text-gray-500 mt-6">
                            No applications added yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto mt-6">

                            <table className="w-full text-left">

                                <thead>
                                    <tr className="border-b">
                                        <th className="p-3">Company</th>
                                        <th className="p-3">Job Title</th>
                                        <th className="p-3">Location</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Applied Date</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {applications.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="border-b"
                                        >

                                            <td className="p-3 font-medium">
                                                {application.company}
                                            </td>

                                            <td className="p-3">
                                                {application.job_title}
                                            </td>

                                            <td className="p-3">
                                                {application.location || "-"}
                                            </td>

                                            <td className="p-3">
                                                <select
                                                    value={application.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            application.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-3 py-2 border rounded-lg bg-white text-sm"
                                                >
                                                    <option value="Applied">Applied</option>
                                                    <option value="Interview">Interview</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Offer">Offer</option>
                                                </select>
                                            </td>

                                            <td className="p-3">
                                                {application.applied_date
                                                    ? new Date(
                                                        application.applied_date
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className="p-3">

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            application.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </main>
        </div>
    );
}

export default Applications;