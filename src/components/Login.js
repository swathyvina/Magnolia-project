import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      console.log(" Login successful!");
      navigate("/"); 
    }
    else(
      console.log(" Invalid email  & password")
    )
  };

  return (
    <div className="sign-in-form">
      <h2>Login</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;


