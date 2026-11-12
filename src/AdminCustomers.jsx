
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCustomers.css";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch("http://localhost:5000/api/admin/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load customers");
        }

        setCustomers(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      String(customer.mobile).includes(search)
    );
  });

  return (
    <div className="admin-customers">
      <h1>Manage Customers</h1>

      <button onClick={() => navigate("/admin/dashboard")}>
        Back to Dashboard
      </button>

      <h3>Total Customers: {customers.length}</h3>

      <input
        type="text"
        placeholder="Search by name, email or mobile..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading customers...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && customers.length === 0 && (
        <p>No customers registered yet.</p>
      )}

      {!loading && !error && filteredCustomers.length === 0 &&
        customers.length > 0 && (
          <p>No matching customers found.</p>
      )}

      {!loading && !error && filteredCustomers.length > 0 && (
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Total Orders</th>
                <th>Total Purchase</th>
                <th>Registered Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.total_orders}</td>
                  <td>
                    ₹{Number(customer.total_purchase).toLocaleString("en-IN")}
                  </td>
                  <td>
                    {new Date(customer.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
