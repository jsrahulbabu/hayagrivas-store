
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminData = JSON.parse(
    sessionStorage.getItem("adminData") || "{}"
  );

  function handleLogout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminData");
    navigate("/admin/login");
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <h3>Welcome, {adminData.name || "Admin"}</h3>

      <p>Manage your E-commerce Store</p>

      <div className="admin-menu">
        <button onClick={() => navigate("/admin/products")}>
          Manage Products
        </button>

        <button onClick={() => navigate("/admin/orders")}>
          Manage Orders
        </button>

        <button onClick={() => navigate("/admin/customers")}>
          View Customers
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
