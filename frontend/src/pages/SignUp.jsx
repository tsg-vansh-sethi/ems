import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    department: "",
    startingDate: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <h1>Lets Get Started!</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Enter your name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          name="fullName"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="email">Enter your email address:</label>
        <input
          type="email"
          placeholder="Enter your email address"
          name="email"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="contact">Enter your phone number</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          name="contact"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="address">Enter your permanent address</label>
        <input
          type="text"
          placeholder="Enter your permanent address"
          name="address"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="department">Enter your Department</label>
        <input
          type="text"
          placeholder="Enter your department"
          name="department"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="startingDate">Enter your starting date</label>
        <input
          type="date"
          placeholder="Enter your starting date"
          name="startingDate"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="role">Role</label>
        <input type="text" placeholder="" name="role" onChange={handleChange} />
        <br />
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account?<Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default SignUp;
