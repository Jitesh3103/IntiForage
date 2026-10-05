import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
    // Handle Login
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Login failed."
                );

            }


            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );


            // Go to Dashboard
            navigate("/dashboard");


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
                    Welcome back
                </p>


                {/* Error */}

                {error && (

                    <div className="mt-5 p-3 bg-red-100 text-red-700 rounded-lg">

                        {error}

                    </div>

                )}


                {/* Login Form */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >


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
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* Register Link */}

                <p className="text-center text-gray-600 mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Create Account
                    </Link>

                </p>

            </div>

        </div>

    );
}


export default Login;