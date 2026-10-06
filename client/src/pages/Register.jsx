import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================================
    // Handle Input Changes
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // Handle Registration
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // Check Passwords

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError("Passwords do not match.");

            return;

        }


        setLoading(true);


        try {

            const response = await fetch(
                "https://intiforage-backend.onrender.com/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed."
                );

            }


            // Successful registration
            // Go to Login

            navigate("/login");


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">


                {/* Home Link */}

                <div className="flex justify-start mb-6">

                    <Link
                        to="/"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        ← Home
                    </Link>

                </div>


                {/* Logo */}

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    IntiForage
                </h1>


                <p className="text-center text-gray-600 mt-2">
                    Create your account
                </p>


                {/* Error */}

                {error && (

                    <div className="mt-5 p-3 bg-red-100 text-red-700 rounded-lg">

                        {error}

                    </div>

                )}


                {/* Register Form */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >


                    {/* Name */}

                    <div>

                        <label className="block mb-1 font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Email */}

                    <div>

                        <label className="block mb-1 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Password */}

                    <div>

                        <label className="block mb-1 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Confirm Password */}

                    <div>

                        <label className="block mb-1 font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* Login Link */}

                <p className="text-center text-gray-600 mt-6">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );
}


export default Register;
