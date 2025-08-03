import React, { useState, useEffect } from "react";
import { itemsAPI, cartAPI, ordersAPI } from "../services/api";
import "./ProductGrid.css";

const ProductGrid = ({ onShowCart, onShowOrders }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const items = await itemsAPI.getItems();

      // Transform backend items into frontend product format
      const transformedProducts = items.map((item, index) => ({
        id: item.id,
        name: item.name,
        price: 9.99 + index * 2.5, // Realistic pricing
        originalPrice: 12.99 + index * 3.0,
        image: getProductImage(item.name),
        category: getProductCategory(item.name),
        rating: 4.2 + index * 0.1, // Realistic ratings
        inStock: item.status === "available",
      }));

      setProducts(transformedProducts);
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (productName) => {
    const imageMap = {
      banana: "🍌",
      bread: "🥖",
      milk: "🥛",
      tomato: "🍅",
      egg: "🥚",
      honey: "🍯",
      lettuce: "🥬",
      cheese: "🧀",
      apple: "🍎",
      orange: "🍊",
    };

    const lowerName = productName.toLowerCase();
    for (const [key, emoji] of Object.entries(imageMap)) {
      if (lowerName.includes(key)) {
        return emoji;
      }
    }
    return "🛍️"; // Default emoji
  };

  const getProductCategory = (productName) => {
    const lowerName = productName.toLowerCase();
    if (
      lowerName.includes("banana") ||
      lowerName.includes("apple") ||
      lowerName.includes("orange")
    ) {
      return "Fruits";
    } else if (lowerName.includes("bread") || lowerName.includes("cake")) {
      return "Bakery";
    } else if (lowerName.includes("milk") || lowerName.includes("cheese")) {
      return "Dairy";
    } else if (lowerName.includes("tomato") || lowerName.includes("lettuce")) {
      return "Vegetables";
    } else if (lowerName.includes("honey") || lowerName.includes("sugar")) {
      return "Pantry";
    }
    return "General";
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.addToCart(productId);
      alert("Item added to cart successfully!");
      fetchCartItems();
    } catch (err) {
      alert("Failed to add item to cart");
      console.error("Error adding to cart:", err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const cart = await cartAPI.getCart();
      setCartItems(cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const orders = await ordersAPI.getOrders();
      setUserOrders(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleShowCart = async () => {
    await fetchCartItems();
    if (cartItems.length > 0) {
      const cartInfo = cartItems
        .map((cart) =>
          cart.items.map((item) => `Cart ID: ${cart.id}, Item: ${item.name}`)
        )
        .flat();
      alert("Cart Items:\n" + cartInfo.join("\n"));
    } else {
      alert("Your cart is empty");
    }
  };

  const handleShowOrders = async () => {
    await fetchOrders();
    if (userOrders.length > 0) {
      const orderInfo = userOrders
        .map(
          (order) =>
            `Order ID: ${order.id}, Date: ${new Date(
              order.created_at
            ).toLocaleDateString()}`
        )
        .join("\n");
      alert("Your Orders:\n" + orderInfo);
    } else {
      alert("No orders found");
    }
  };

  const handleCheckout = async () => {
    try {
      await fetchCartItems();
      if (cartItems.length === 0) {
        alert("Your cart is empty. Add some items first!");
        return;
      }

      const activeCart = cartItems.find((cart) => cart.status === "active");
      if (!activeCart) {
        alert("No active cart found");
        return;
      }

      await ordersAPI.createOrder(activeCart.id);
      alert("Order placed successfully!");

      fetchProducts();
    } catch (err) {
      alert("Failed to place order");
      console.error("Error creating order:", err);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getDiscountPercentage = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  if (loading) {
    return (
      <section className="products-section">
        <div className="products-container">
          <div className="loading">Loading products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-section">
        <div className="products-container">
          <div className="error">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2>Featured Products</h2>
          <p>Fresh and quality products for your daily needs</p>
        </div>

        <div className="action-buttons">
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
          <button className="cart-btn" onClick={handleShowCart}>
            Cart
          </button>
          <button className="orders-btn" onClick={handleShowOrders}>
            Order History
          </button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span className="product-emoji">{product.image}</span>
                {product.originalPrice > product.price && (
                  <div className="discount-badge">
                    -
                    {getDiscountPercentage(
                      product.originalPrice,
                      product.price
                    )}
                    %
                  </div>
                )}
                <div className="product-overlay">
                  <button
                    className="quick-view-btn"
                    onClick={() => console.log(`Quick view ${product.id}`)}>
                    Quick View
                  </button>
                </div>
              </div>

              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${
                          i < Math.floor(product.rating) ? "filled" : ""
                        }`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">({product.rating})</span>
                </div>

                <div className="product-price">
                  <span className="current-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="original-price">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.inStock}>
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="products-footer">
          <button className="load-more-btn">Load More Products</button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
