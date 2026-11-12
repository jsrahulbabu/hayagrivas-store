import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Backend returned HTML instead of JSON. Check the API URL."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store login details for this browser session
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem(
        "customer",
        JSON.stringify(data.customer)
      );

      setMessage("Login successful!");

      // Return to the requested page, or Home
      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });

    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Customer Login</h2>

        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <div className="password-wrapper">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="forgot-password">
          <span>Forgot Password?</span>
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p role="status" className="login-message">
            {message}
          </p>
        )}

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
