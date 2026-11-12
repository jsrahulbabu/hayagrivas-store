import { Link, useLocation } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    return (
      <div className="confirmation-page">
        <h1>Order Confirmation</h1>
        <p>Order details are not available.</p>
        <Link to="/">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <h1>Order Placed Successfully!</h1>

      <p>Thank you for your purchase.</p>

      <h2>Order ID: {order.orderId}</h2>

      <h3>
        Total Amount: ₹
        {Number(order.total).toLocaleString("en-IN")}
      </h3>

      <p>Payment Method: Cash on Delivery (COD)</p>

      <p>Your order has been received successfully.</p>

      <Link to="/">Continue Shopping</Link>
    </div>
  );
}

export default OrderConfirmation;
