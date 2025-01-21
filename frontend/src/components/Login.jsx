import React, { useState } from 'react';

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="form-container">
            <h1>Welcome!</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter your registered email address</label>
                <input type="email" placeholder="Enter your email address" name="email" onChange={handleChange} />
                <label htmlFor="password">Enter your registered password</label>
                <input type="password" placeholder="Enter your password" name="password" onChange={handleChange}/>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account?<a href='#'>Sign Up</a></p>
        </div>
    );
}

export default Login;
