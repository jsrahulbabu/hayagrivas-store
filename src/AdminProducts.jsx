
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
    category: "Rice",
  });

  const categories = [
    "Rice",
    "Dal",
    "Oil",
    "Snacks",
    "Beverages",
    "Household",
  ];

  const token = sessionStorage.getItem("adminToken");

  // Fetch all products
  async function fetchProducts() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchProducts();
  }, []);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Reset form
  function resetForm() {
    setFormData({
      name: "",
      price: "",
      description: "",
      image_url: "",
      category: "Rice",
    });

    setEditingId(null);
  }

  // Add or Update Product
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/products/${editingId}`
        : "http://localhost:5000/api/admin/products";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product operation failed");
      }

      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      await fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Edit Product
  function handleEdit(product) {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image_url: product.image_url || "",
      category: product.category,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete Product
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product deletion failed");
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage("Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="admin-products">
      <h1>Manage Products</h1>

      <button onClick={() => navigate("/admin/dashboard")}>
        Back to Dashboard
      </button>

      <h2>
        {editingId ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={formData.price}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image_url"
          placeholder="Product Image URL"
          value={formData.image_url}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <h2>Existing Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>

              <p>Price: ₹{product.price}</p>
              <p>Category: {product.category}</p>
              <p>Description: {product.description}</p>

              <button onClick={() => handleEdit(product)}>
                Edit
              </button>

              <button onClick={() => handleDelete(product.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
