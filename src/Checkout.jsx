import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Checkout.css";

function Checkout({ cart, setCart }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

useEffect(() => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    navigate("/login", {
      state: { from: "/checkout" },
      replace: true,
    });
  } else {
    setAuthChecked(true);
  }
}, [navigate]);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            customer_name: name,
            phone: phone,
            address: address,
            items: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order failed");
      }

      // setMessage(
      //   `Order placed successfully! Order ID: ${data.orderId}. Payment: Cash on Delivery.`
      // );

      // setCart([]);

      setCart([]);

navigate("/order-confirmation", {
  state: {
    orderId: data.orderId,
    total: data.total,
  },
});

 

    } catch (error) {
      console.error("Order error:", error);
      setMessage(
        "Unable to place order. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return <p>Checking login...</p>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <Link to="/cart">← Back to Cart</Link>

      <h2>Delivery Details</h2>

      <form onSubmit={handleSubmit}>
        <label>Customer Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Mobile Number</label>
        <input
          type="tel"
          pattern="[0-9]{10}"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <h3>Payment Method</h3>
        <p>Cash on Delivery (COD)</p>

        <h3>
          Order Total: ₹{total.toLocaleString("en-IN")}
        </h3>

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Checkout;

