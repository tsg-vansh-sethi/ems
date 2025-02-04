import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { AuthContext } from "../components/AuthProvider.jsx";
function Login() {
  const navigate = useNavigate();
  const { login, userRole, userEmail } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const handleChange = (e) => {
    setOpenAlert(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.message;
      setOpenAlert(true);
      setMessage(errorMessage);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-full max-w-8xl h-full relative">
        {openAlert && (
          <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
            <Alert
              severity="error"
              className="w-3/4 max-w-lg"
              sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {message}
            </Alert>
          </div>
        )}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-12 lg:p-20">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Log in to access your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
        <div className="hidden md:block w-full md:w-1/2 h-full">
          <img
            src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
            alt="Employees working"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
