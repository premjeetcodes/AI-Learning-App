import { useState } from "react";
import "./Auth.css";
import { login as apiLogin, signup as apiSignup } from "./api";

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const res = await apiLogin({ email: email.trim(), password });
        // axios returns data in res.data
        const data = res.data || {};
        if (!res || res.status >= 400) {
          setError((data && data.message) || "Login failed");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", data.token);
        onAuth();
      } else {
        const res = await apiSignup({ email: email.trim(), password });
        const data = res.data || {};
        if (!res || res.status >= 400) {
          setError((data && data.message) || "Signup failed");
          setLoading(false);
          return;
        }
        setError("");
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        alert("Signup successful! Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left side - Login */}
        <div className={`auth-form login-form ${isLogin ? "active" : ""}`}>
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-input"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="toggle-section">
            <p>Don't have an account? <button type="button" className="toggle-btn" onClick={() => { setIsLogin(false); setError(""); }}>Sign Up</button></p>
          </div>
        </div>

        {/* Right side - Signup (Mirror) */}
        <div className={`auth-form signup-form ${!isLogin ? "active" : ""}`}>
          <h2>Create Account</h2>
          <p className="subtitle">Join us today</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="form-input"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Loading..." : "Create Account"}
            </button>
          </form>

          <div className="toggle-section">
            <p>Already have an account? <button type="button" className="toggle-btn" onClick={() => { setIsLogin(true); setError(""); }}>Sign In</button></p>
          </div>
        </div>

        {/* Login Icon - Right Side */}
        <div className={`auth-icon login-icon ${isLogin ? "active" : ""}`}>
          <svg viewBox="0 0 200 200" width="120" height="120">
            <circle cx="100" cy="60" r="35" fill="rgba(100, 200, 255, 0.8)" opacity="0.8"/>
            <path d="M 70 110 Q 70 95 85 95 L 115 95 Q 130 95 130 110 L 130 160 Q 130 170 120 170 L 80 170 Q 70 170 70 160 Z" fill="rgba(100, 200, 255, 0.6)" opacity="0.7"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="2" opacity="0.5"/>
          </svg>
          <p className="icon-text">Sign in to continue</p>
        </div>

        {/* Signup Icon - Left Side */}
        <div className={`auth-icon signup-icon ${!isLogin ? "active" : ""}`}>
          <svg viewBox="0 0 200 200" width="120" height="120">
            <circle cx="100" cy="55" r="32" fill="rgba(100, 200, 255, 0.8)" opacity="0.8"/>
            <path d="M 75 105 Q 75 92 88 92 L 112 92 Q 125 92 125 105 L 125 155 Q 125 165 115 165 L 85 165 Q 75 165 75 155 Z" fill="rgba(100, 200, 255, 0.6)" opacity="0.7"/>
            <g transform="translate(130, 75)">
              <circle cx="0" cy="0" r="18" fill="rgba(100, 200, 255, 0.8)" opacity="0.8"/>
              <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(30, 30, 60, 0.9)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(30, 30, 60, 0.9)" strokeWidth="3" strokeLinecap="round"/>
            </g>
            <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(100, 200, 255, 0.2)" strokeWidth="2" opacity="0.5"/>
          </svg>
          <p className="icon-text">Create your account</p>
        </div>

        {/* Slider Toggle */}
        <div className={`slider ${isLogin ? "left" : "right"}`}></div>
      </div>
    </div>
  );
}
