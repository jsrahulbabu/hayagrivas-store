import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: { from: `/order-details/${id}` },
        replace: true,
      });
      return;
    }

    fetch(`http://localhost:5000/api/my-orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load order");
        }

        setOrder(data.order);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p>Loading order details...</p>;

  if (error) return <p>Error: {error}</p>;

  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-details">
      <h1>Order Details</h1>

      <h3>Order #{order.id}</h3>


      <p>
  <strong>Order Status:</strong>{" "}
  <span className="order-status">
    {order.status || "Pending"}
  </span>
</p>

      <p>
      <strong>Order Date:</strong>{" "}
      {order.created_at
      ? new Date(order.created_at).toLocaleDateString("en-IN")
      : "Not available"}
      </p>

      <p>
        <strong>Customer:</strong> {order.customer_name}
      </p>

      <p>
        <strong>Phone:</strong> {order.phone}
      </p>

      <p>
        <strong>Delivery Address:</strong> {order.address}
      </p>

      <p>
        <strong>Payment Method:</strong>{" "}
        {order.payment_method}
      </p>

      <h2>Ordered Products</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{item.product_name}</td>
              <td>₹{Number(item.price).toLocaleString("en-IN")}</td>
              <td>{item.quantity}</td>
              <td>₹{Number(item.subtotal).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>
        Total Amount: ₹
        {Number(order.total_amount).toLocaleString("en-IN")}
      </h2>

      <Link to="/my-orders">Back to My Orders</Link>
    </div>
  );
}

export default OrderDetails;