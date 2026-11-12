
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyAccount.css";

function MyAccount() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  email: "",
  mobile: "",
});
const [message, setMessage] = useState("");
const [showPasswordForm, setShowPasswordForm] = useState(false);

const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [passwordMessage, setPasswordMessage] = useState("");
const [passwordSaving, setPasswordSaving] = useState(false);
const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: { from: "/my-account" },
        replace: true,
      });
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load account");
        }

        setCustomer(data.customer);
        setFormData({
  name: data.customer.name || "",
  email: data.customer.email || "",
  mobile: data.customer.mobile || "",
});
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

async function handleUpdateProfile(event) {
  event.preventDefault();

  setMessage("");
  setSaving(true);

  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/auth/update-profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    setCustomer(data.customer);
    setFormData({
      name: data.customer.name || "",
      email: data.customer.email || "",
      mobile: data.customer.mobile || "",
    });

    sessionStorage.setItem(
      "customer",
      JSON.stringify(data.customer)
    );

    setIsEditing(false);
    setMessage("Profile updated successfully!");
  } catch (err) {
    setMessage(err.message);
  } finally {
    setSaving(false);
  }
}


async function handleChangePassword(event) {
  event.preventDefault();
  setPasswordMessage("");

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordMessage("New passwords do not match.");
    return;
  }

  if (passwordData.newPassword.length < 8) {
    setPasswordMessage("Password must be at least 8 characters.");
    return;
  }

  setPasswordSaving(true);

  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/auth/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to change password.");
    }

    setPasswordMessage("Password changed successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);
  } catch (error) {
    setPasswordMessage(error.message);
  } finally {
    setPasswordSaving(false);
  }
}


  if (loading) {
    return <p>Loading account...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("customer");
            navigate("/login", { replace: true });
          }}
        >
          Login Again
        </button>
      </div>
    );
  }

  
return (
  <div className="my-account">
    <h1>My Account</h1>

    {message && <p className="profile-message">{message}</p>}

    {customer && !isEditing && (
      <div>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Mobile:</strong> {customer.mobile}</p>

        <button
          onClick={() => {
            setFormData({
              name: customer.name || "",
              email: customer.email || "",
              mobile: customer.mobile || "",
            });
            setMessage("");
            setIsEditing(true);
          }}
        >
          Edit Profile
        </button>
      </div>
    )}

    {isEditing && (
      <form
        onSubmit={handleUpdateProfile}
        className="edit-profile-form"
      >
        <h2>Edit Profile</h2>

        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
          required
        />

        <label>Mobile Number</label>
        <input
          type="tel"
          value={formData.mobile}
          onChange={(event) =>
            setFormData({ ...formData, mobile: event.target.value })
          }
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setMessage("");
          }}
          disabled={saving}
        >
          Cancel
        </button>
      </form>
    )}


<div className="change-password-section">
  <h2>Security</h2>

  {passwordMessage && (
    <p role="status">{passwordMessage}</p>
  )}

  {!showPasswordForm && (
    <button
      type="button"
      onClick={() => {
        setPasswordMessage("");
        setShowPasswordForm(true);
      }}
    >
      Change Password
    </button>
  )}

  {showPasswordForm && (
    <form onSubmit={handleChangePassword}>
      <label>Current Password</label>
      <input
        type="password"
        value={passwordData.currentPassword}
        onChange={(event) =>
          setPasswordData({
            ...passwordData,
            currentPassword: event.target.value,
          })
        }
        required
        autoComplete="current-password"
      />

      <label>New Password</label>
      <input
        type="password"
        value={passwordData.newPassword}
        onChange={(event) =>
          setPasswordData({
            ...passwordData,
            newPassword: event.target.value,
          })
        }
        minLength={8}
        required
        autoComplete="new-password"
      />

      <label>Confirm New Password</label>
      <input
        type="password"
        value={passwordData.confirmPassword}
        onChange={(event) =>
          setPasswordData({
            ...passwordData,
            confirmPassword: event.target.value,
          })
        }
        minLength={8}
        required
        autoComplete="new-password"
      />

      <button type="submit" disabled={passwordSaving}>
        {passwordSaving ? "Updating..." : "Update Password"}
      </button>

      <button
        type="button"
        disabled={passwordSaving}
        onClick={() => {
          setShowPasswordForm(false);
          setPasswordMessage("");
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
      >
        Cancel
      </button>
    </form>
  )}
</div>


    <div className="account-actions">
      <Link to="/my-orders">My Orders</Link>
      <Link to="/">Back to Home</Link>

      <button
        onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to logout?"
          );

          if (confirmed) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("customer");
            alert("You have been logged out successfully!");
            navigate("/", { replace: true });
          }
        }}
      >
        Logout
      </button>
    </div>
  </div>
);


}

export default MyAccount;
