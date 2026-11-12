
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({ cart, setCart }) {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id, change) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
<br></br>

      <Link to="/">← Continue Shopping</Link>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image_url} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>Price: ₹{Number(item.price).toLocaleString("en-IN")}</p>

                <button onClick={() => updateQuantity(item.id, -1)}>
                  -
                </button>

                <span> {item.quantity} </span>

                <button onClick={() => updateQuantity(item.id, 1)}>
                  +
                </button>

                <p>
                  Subtotal: ₹
                  {(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                </p>

                <button onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>
          
<Link to="/checkout" className="checkout-button">
  Proceed to Checkout
</Link>

        </>
      )}
    </div>
  );
}

export default Cart;

