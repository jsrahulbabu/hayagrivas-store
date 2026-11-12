// import { useEffect, useState } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";

// function ProductDetails({ addToCart }) {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:5000/api/products")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const selectedProduct = data.find(
//           (item) => String(item.id) === id
//         );

//         if (!selectedProduct) {
//           setError("Product not found");
//         } else {
//           setProduct(selectedProduct);
//         }
//       })
//       .catch(() => {
//         setError("Unable to load product details");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) {
//     return <h2>Loading product...</h2>;
//   }

//   if (error) {
//     return <h2>{error}</h2>;
//   }

//   return (
//     <div className="product-details">
//       <Link to="/" className="back-link">
//         ← Back to Products
//       </Link>

//       <div className="product-details-card">
//         <img
//           src={product.image_url}
//           alt={product.name}
//         />

//         <div>
//           <p className="category">{product.category}</p>
//           <h1>{product.name}</h1>

//           <p className="price">
//             ₹{Number(product.price).toLocaleString("en-IN")}
//           </p>

//           <p>{product.description || "No description available."}</p>

//           <button
//   onClick={() => {
//     addToCart(product);
//     navigate("/cart");
//   }}
// >
//   Add to Cart
// </button>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetails;


import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails({ addToCart }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        const selectedProduct = data.find(
          (item) => String(item.id) === id
        );

        if (!selectedProduct) {
          setError("Product not found");
        } else {
          setProduct(selectedProduct);
        }
      })
      .catch(() => {
        setError("Unable to load product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  function handleAddToCart() {
    addToCart(product);
    setCartMessage(true);
  }

  if (loading) {
    return <div className="details-status">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="details-status">
        <h2>{error}</h2>
        <Link to="/" className="details-back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  return (


    <div className="product-details-page">

      <div className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <span>{product.category}</span>
        <span> / </span>
        <strong>{product.name}</strong>
      </div>

      <Link to="/#products" className="details-back-link">
        ← Continue Shopping
      </Link>

      <div className="product-details-card">

        <div className="details-image-container">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="details-product-image"
            />
          ) : (
            <div className="details-no-image">
              Product Image Not Available
            </div>
          )}
        </div>

        <div className="details-product-info">

          <span className="details-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="details-description">
            {product.description || "No description available."}
          </p>

          <div className="details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <p className="details-availability">
            ✓ Available for Shopping
          </p>

          <div className="details-actions">

            <button
              type="button"
              className="details-add-cart"
              onClick={handleAddToCart}
            >
              Add to Cart +
            </button>

            <button
              type="button"
              className="details-buy-now"
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
            >
              Go to Cart →
            </button>

          </div>

          {cartMessage && (
            <div className="details-cart-success">
              ✓ {product.name} added to cart successfully!
              <button
                type="button"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>
            </div>
          )}

          <div className="details-benefits">
            <p>🛒 Easy Online Shopping</p>
            <p>💰 Budget-Friendly Prices</p>
            <p>🏠 Everyday Household Essentials</p>
          </div>

        </div>

      </div>

    </div>
    
  );
}

export default ProductDetails;

