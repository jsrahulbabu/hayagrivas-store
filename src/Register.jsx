
import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || "Registration failed");
    //   }

const responseText = await response.text();
console.log("Registration response:", responseText);

let data;

try {
  data = JSON.parse(responseText);
} catch {
  throw new Error(
    "Backend returned HTML instead of JSON. Check the API URL and backend route."
  );
}

if (!response.ok) {
  throw new Error(data.message || "Registration failed");
}

      setMessage("Registration successful!");

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <h2>Customer Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          pattern="[+]?[0-9]{10,15}"
          title="Enter 10 to 15 digits, optionally starting with +"
          required
        />

         {/* <input
          type="password"
          name="password"
          placeholder="Password (minimum 8 characters)"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />  */}

        <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter Password"
    value={formData.password}
    onChange={handleChange}
    required
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? "🙈" : "👁️"}
  </button>

</div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
    </div>
  );
}

export default Register;
