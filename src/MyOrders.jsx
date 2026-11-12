
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = sessionStorage.getItem("token");

//     if (!token) {
//       navigate("/login", {
//         state: { from: "/my-orders" },
//         replace: true,
//       });
//       return;
//     }

//     fetch("http://localhost:5000/api/my-orders", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(async (response) => {
//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || "Unable to load orders");
//         }

//         setOrders(data.orders || []);
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [navigate]);

//   if (loading) return <p>Loading your orders...</p>;

//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="my-orders">
//       <h1>My Orders</h1>

//       {orders.length === 0 ? (
//         <p>You haven't placed any orders yet.</p>
//       ) : (
//         orders.map((order) => (
//           <div className="order-card" key={order.id}>
//             <h3>Order #{order.id}</h3>
//             <p>
//               <strong>Customer:</strong> {order.customer_name}
//             </p>
//             <p>
//               <strong>Total:</strong> ₹
//               {Number(order.total_amount).toLocaleString("en-IN")}
//             </p>
//             <p>
//               <strong>Payment:</strong> {order.payment_method}
//             </p>
            
//             <Link
//   to={`/order-details/${order.id}`}
//   className="view-details-button"
// >
//   View Details
// </Link>

// <div className="ordered-products">
//   <h4>Products</h4>

//   <div className="order-table-wrapper">
//     <table className="order-table">
//       <thead>
//         <tr>
//           <th>Product</th>
//           <th>Price</th>
//           <th>Qty</th>
//           <th>Subtotal</th>
//         </tr>
//       </thead>

//       <tbody>
//         {order.items?.map((item, index) => (
//           <tr key={`${order.id}-${index}`}>
//             <td>{item.product_name}</td>
//             <td>
//               ₹{Number(item.price).toLocaleString("en-IN")}
//             </td>
//             <td>{item.quantity}</td>
//             <td>
//               ₹{Number(item.subtotal).toLocaleString("en-IN")}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>


//           </div>
//         ))
//       )}

//       <Link to="/my-account">Back to My Account</Link>
//     </div>
//   );
// }

// export default MyOrders;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: { from: "/my-orders" },
        replace: true,
      });
      return;
    }

    fetch("http://localhost:5000/api/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders");
        }

        setOrders(data.orders || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Loading your orders...</p>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-orders">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            <h3>Order #{order.id}</h3>

            <p>
              <strong>Customer:</strong> {order.customer_name}
            </p>

            <p>
              <strong>Total:</strong> ₹
              {Number(order.total_amount).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Payment:</strong> {order.payment_method}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              <span className={`order-status ${(
                order.status || "Pending"
              ).toLowerCase()}`}>
                {order.status || "Pending"}
              </span>
            </p>

            <Link
              to={`/order-details/${order.id}`}
              className="view-details-button"
            >
              View Details
            </Link>

            <div className="ordered-products">
              <h4>Products</h4>

              <div className="order-table-wrapper">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={`${order.id}-${index}`}>
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
              </div>
            </div>
          </div>
        ))
      )}

      <Link to="/my-account">Back to My Account</Link>
    </div>
  );
}

export default MyOrders;

