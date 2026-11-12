
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const token = sessionStorage.getItem("adminToken");

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  async function fetchOrders() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(data);

      const statusValues = {};
      data.forEach((order) => {
        statusValues[order.id] = order.status || "Pending";
      });

      setSelectedStatus(statusValues);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(orderId) {
    const newStatus = selectedStatus[orderId];

    try {
      setUpdatingId(orderId);
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      setMessage(`Order #${orderId} status updated successfully`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchOrders();
  }, []);

  return (
    <div className="admin-orders">
      <h1>Manage Orders</h1>

      <button onClick={() => navigate("/admin/dashboard")}>
        Back to Dashboard
      </button>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="admin-order-card">

            <h2>Order #{order.id}</h2>

            <h3>Customer Details</h3>

            <p>
              <strong>Customer Name:</strong> {order.customer_name}
            </p>

            <p>
              <strong>Mobile Number:</strong> {order.phone}
            </p>

            <p>
              <strong>Delivery Address:</strong> {order.address}
            </p>

            <h3>Order Details</h3>

            <p>
              <strong>Order Date:</strong>{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString("en-IN")
                : "Not available"}
            </p>

            <p>
              <strong>Payment Method:</strong> {order.payment_method}
            </p>

            <h3>Ordered Products</h3>

            {order.items && order.items.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        ₹{Number(item.subtotal).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No product details available.</p>
            )}

            <h3>
              Total Amount: ₹
              {Number(order.total_amount).toLocaleString("en-IN")}
            </h3>

            <p>
              <strong>Current Status:</strong> {order.status || "Pending"}
            </p>

            <label>Update Order Status:</label>

            <select
              value={selectedStatus[order.id] || "Pending"}
              onChange={(event) =>
                setSelectedStatus((previous) => ({
                  ...previous,
                  [order.id]: event.target.value,
                }))
              }
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleStatusUpdate(order.id)}
              disabled={updatingId === order.id}
            >
              {updatingId === order.id
                ? "Updating..."
                : "Update Status"}
            </button>

            <hr />

          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
