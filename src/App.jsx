
import './App.css';
import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import Register from "./Register";
import Login from "./Login";
import MyAccount from "./MyAccount";
import MyOrders from "./MyOrders";
import OrderDetails from "./OrderDetails";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import Offers from "./Offers";
import Contact from "./Contact";



function Header({ cart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function closeMenus() {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }


return (
  <>
    <div className="top-contact-bar">
      <div className="top-contact-left">
        <a href="#tel:+918220959648">
           <span>📞</span>
          <i className="fa-solid fa-phone"></i>
          Take Phone Call Orders
        </a>

        <span>|</span>

        <a href="https://wa.me/918220959648" target="_blank" rel="noreferrer">
        <span> 🟢</span>
          <i className="fa-brands fa-whatsapp"></i>
          WhatsApp Orders
        </a>
      </div>

      <div className="top-contact-right">
        <i className="fa-solid fa-phone"></i>
        <a href="https://wa.me/918220959648" target="_blank" rel="noreferrer">
        +91 8220959648
        </a>
      </div>
    </div>

    <header className="header">


      <Link to="/" className="logo">
  <img
    src="/images/hayagrivas-logo.png"
    alt="Hayagrivas Online Shopping"
  />
</Link>

      <button
        className="hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Link to="/" onClick={closeMenus}>HOME</Link>

<Link to="/offers" onClick={closeMenus} >OFFERS</Link>

        <div className="account-menu">
          <button
            type="button"
            className="account-menu-button"
            onClick={() => setAccountMenuOpen((previous) => !previous)}
          >
            MY ACCOUNT <span>∨</span>
          </button>

          <div className={`account-dropdown ${accountMenuOpen ? "show" : ""}`}>
            <Link to="/login" onClick={closeMenus}>Login</Link>
            <Link to="/register" onClick={closeMenus}>Register</Link>
            <Link to="/my-account" onClick={closeMenus}>My Account</Link>
            <Link to="/my-orders" onClick={closeMenus}>My Orders</Link>
          </div>
        </div>

        <Link to="/contact" onClick={closeMenus}>CONTACT US</Link>
      </nav>

      <div className="header-actions">
        <Link
          to="/my-account"
          className="user-icon"
          aria-label="My Account"
          title="My Account"
        >
          👨🏻‍💼
        </Link>

        <Link to="/cart" className="cart-link">
          🛒 <span>{cartCount}</span>
        </Link>
      </div>
    </header>
      </>
  );
}


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [cartMessage, setCartMessage] = useState("null");

  
const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
});

useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);


  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("Products load aagavillai!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  
const addToCart = (product) => {
  setCart((previousCart) => {
    const existingProduct = previousCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      return previousCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...previousCart, { ...product, quantity: 1 }];
  });

  // setCartMessage(`${product.name} added to cart successfully!`);
  setCartMessage(product.id);

};

useEffect(() => {
  if (cartMessage === null) return;

  const timer = setTimeout(() => {
    setCartMessage(null);
  }, 3000);

  return () => clearTimeout(timer);
}, [cartMessage]);

const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    product.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

// Search / Category change aana Page 1-ku return
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, selectedCategory]);

// Pagination
const productsPerPage = 24;

const totalPages = Math.ceil(
  filteredProducts.length / productsPerPage
);

const startIndex = (currentPage - 1) * productsPerPage;

const currentProducts = filteredProducts.slice(
  startIndex,
  startIndex + productsPerPage
);

  return (

    <div className="app-shell">

    <Header cart={cart} />

    <Routes>
    <Route
      path="/products/:id"
      element={<ProductDetails addToCart={addToCart} />}
    />

<Route
  path="/cart"
  element={<Cart cart={cart} setCart={setCart} />}
/>

<Route
  path="/checkout"
  element={<Checkout cart={cart} setCart={setCart} />}
/>

<Route
  path="/order-confirmation"
  element={<OrderConfirmation />}
/>

<Route path="/register" element={<Register />} />

<Route path="/login" element={<Login />} />

<Route path="/my-account" element={<MyAccount />} />

<Route path="/my-orders" element={<MyOrders />} />

<Route path="/order-details/:id" element={<OrderDetails />} />

<Route path="/admin/login" element={<AdminLogin />} />

<Route path="/admin/dashboard" element={<AdminDashboard />} />

<Route path="/admin/products" element={<AdminProducts />} />

<Route path="/admin/customers" element={<AdminCustomers />} />

<Route path="/offers" element={<Offers />} />

<Route path="/contact" element={<Contact />} />

<Route
  path="/admin/orders"
  element={<AdminOrders />}
/> 

    <Route
      path="/"
      element={
        <div className="store">

      <main>
        <section className="hero" id="home">
  <div className="hero-content">
    <p className="eyebrow">WELCOME TO HAYAGRIVAS STORE</p>

    <h1>
      Fresh Groceries.
      <span> Better Everyday.</span>
    </h1>

    <p className="hero-description">
      Shop your daily essentials at affordable prices.
      Quality groceries and convenient shopping, all in one place.
    </p>

    <a className="shop-button" href="#products">
      Shop Now <span>→</span>
    </a>

    <div className="hero-features">
      <span>✓ Everyday Essentials</span>
      <span>✓ Budget-Friendly Shopping</span>
    </div>
  </div>

  
<div className="hero-visual">

  <div className="hero-slideshow">

    <img
      src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
      alt="Fresh vegetables and groceries"
    />

    <img
      src="https://images.unsplash.com/photo-1543168256-418811576931?w=900"
      alt="Fresh fruits and vegetables"
    />

    <img
      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900"
      alt="Healthy fresh grocery essentials"
    />

  </div>

  <div className="hero-image-label">
    <span>Fresh Choices</span>
    <strong>For Every Home</strong>
  </div>

</div>

</section>

<section className="product-section" id="products">

<div className="shopping-filters">

  <div className="product-search">
    <span className="search-icon">🔍</span>

    <input
      id="productSearch"
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <div className="category-filter">

    <label htmlFor="category">Category:</label>

    <select
      id="category"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="All">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Accessories">Accessories</option>
      <option value="Oil">Oil</option>
    </select>

  </div>

</div>

  <h2>Products List</h2>
<br></br>
{cartMessage && (
  <div className="cart-success-message">
    ✓ {cartMessage}
  </div>
)}

  {loading && <p>Loading products...</p>}

  {error && <p className="error">{error}</p>}

  {!loading && !error && products.length === 0 && (
    <p>No products available yet.</p>
  )}

  {!loading && !error && products.length > 0 && (

    <div className="products">

      {filteredProducts.length > 0 ? (
        currentProducts.map((product) => (

          <article className="product-card" key={product.id}>

            <div className="product-image">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} />
              ) : (
                <span className="no-image">Product Image</span>
              )}
            </div>

            <div className="product-info">

              <p className="category">{product.category}</p>

              <h3>{product.name}</h3>

              <p className="price">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>

              <div className="product-actions">

  <Link
    to={`/products/${product.id}`}
    className="view-product-btn"
  >
    View Product →
  </Link>

  <button
    type="button"
    className="add-to-cart-btn"
    onClick={() => addToCart(product)}
  >
    Add to Cart +
  </button>

  {String(cartMessage) === String(product.id) && (
  <div className="cart-success-message">
    ✓ {product.name} added to cart successfully!
  </div>
)}

</div>

            </div>

          </article>

        ))
      ) : (

        <p className="no-products">
          No products found. Try another search.
        </p>

      )}

    </div>

  )}

{!loading && !error && totalPages > 1 && (
  <div className="pagination">

    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((previous) => previous - 1)
      }
    >
      ← Previous
    </button>

    {Array.from(
      { length: totalPages },
      (_, index) => index + 1
    ).map((page) => (
      <button
        type="button"
        key={page}
        className={
          currentPage === page ? "active-page" : ""
        }
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    <button
      type="button"
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((previous) => previous + 1)
      }
    >
      Next →
    </button>

  </div>
)}

</section>
        

      </main>

<section className="offers-section" id="offers">

  <div className="offers-heading">
    <p className="eyebrow">SPECIAL SAVINGS</p>
    <h2>Budget-Friendly Grocery Packs</h2>
    <p>Save time and money with our everyday grocery essentials.</p>
  </div>

  <div className="offers-container">

    <div className="offer-card">
      <span className="offer-tag">WEEKLY PACK</span>
      <h3>1 Week Grocery Pack</h3>
      <p>Essential groceries for your family's weekly needs.</p>
      <Link to="/#products" className="offer-button">
        Explore Products →
      </Link>
    </div>

    <div className="offer-card featured-offer">
      <span className="offer-tag">POPULAR CHOICE</span>
      <h3>2 Weeks Grocery Pack</h3>
      <p>Plan your shopping for two weeks with everyday essentials.</p>
      <Link to="/#products" className="offer-button">
        Explore Products →
      </Link>
    </div>

    <div className="offer-card">
      <span className="offer-tag">MONTHLY PACK</span>
      <h3>1 Month Grocery Pack</h3>
      <p>Convenient grocery shopping for your entire month.</p>
      <Link to="/#products" className="offer-button">
        Explore Products →
      </Link>
    </div>

  </div>
</section>


{/* WHY CHOOSE US SECTION */}

<section className="why-us-section" id="why-us">

  <div className="why-us-heading">
    <p className="eyebrow">WHY CHOOSE US</p>
    <h2>Why Shop at Hayagrivas Store?</h2>
    <p>Making everyday shopping simple and convenient for every home.</p>
  </div>

  <div className="why-us-container">

    <div className="why-us-card">
      <div className="why-us-icon">💰</div>
      <h3>Affordable Prices</h3>
      <p>Everyday essentials at reasonable and budget-friendly prices.</p>
    </div>

    <div className="why-us-card">
      <div className="why-us-icon">🛒</div>
      <h3>Easy Shopping</h3>
      <p>Browse products and place your orders conveniently online.</p>
    </div>

    <div className="why-us-card">
      <div className="why-us-icon">🌾</div>
      <h3>Everyday Essentials</h3>
      <p>Find your daily grocery and household essentials in one place.</p>
    </div>

    <div className="why-us-card">
      <div className="why-us-icon">🏠</div>
      <h3>For Every Home</h3>
      <p>Shopping options designed around everyday household needs.</p>
    </div>

  </div>

</section>

{/* ABOUT US SECTION */}

<section className="about-section" id="about">

  <div className="about-content">

    <div className="about-image">
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
        alt="Fresh groceries at Hayagrivas Store"
      />
    </div>

    <div className="about-text">

      <p className="eyebrow">ABOUT OUR STORE</p>

      <h2>Welcome to Hayagrivas Store</h2>

      <p>
        Hayagrivas Store aims to make everyday grocery
        shopping simple, convenient and affordable for
        every household.
      </p>

      <p>
        From daily cooking essentials to household
        necessities, our goal is to help customers
        find the products they need in one convenient place.
      </p>

      <p>
        We believe that quality everyday essentials
        should be accessible at reasonable prices.
      </p>

      <a href="#products" className="about-button">
        Explore Our Products →
      </a>

    </div>

  </div>

</section>

            <footer className="main-footer" id="footer">

  {/* Follow Us Section */}
  <div className="follow-section">
    <h2>Follow Us</h2>
    <p>Stay connected with Hayagrivas Store</p>

    <div className="social-links">
      <a href="#" target="_blank" rel="noreferrer">
        Instagram
      </a>

      <a href="#" target="_blank" rel="noreferrer">
        Facebook
      </a>

      <a href="#" target="_blank" rel="noreferrer">
        WhatsApp
      </a>
    </div>
  </div>

  {/* Footer Main Content */}
  <div className="footer-container">

    <div className="footer-column footer-about">
      <h2>Hayagrivas Store</h2>
      <p>
        Your trusted online shopping destination
        for everyday grocery essentials.
        Quality products at affordable prices.
      </p>

      <p className="service-highlight">
        Online Shopping Available 24/7
      </p>
    </div>

    <div className="footer-column">
      <h3>Quick Links</h3>

      <Link to="/#home">Home</Link>
      <Link to="/#products">Shop Products</Link>
      <Link to="/#about">About Us</Link>
      <Link to="/#why-us">Why Choose Us?</Link>
      <Link to="/#footer">Contact Us</Link>
      <Link to="/terms">Terms & Conditions</Link>
    </div>

    <div className="footer-column">
      <h3>Contact Us</h3>

      <p>📍 174, South Perumal Mestri Street, South Gate, Madurai -625001, Tamil Nadu</p>
      <p>📞 +91 8220959648</p>
      <p>✉️ jsrahulbabu15@gmail.com</p>
    </div>

  </div>

  <div className="footer-bottom">
    <p>
      © 2026 Hayagrivas Store. All Rights Reserved.
    </p>
  </div>

</footer>

        </div>
      }
    />

    </Routes>

  </div>
);

}


export default App;
