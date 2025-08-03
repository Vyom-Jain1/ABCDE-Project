import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left side - Product Image */}
        <div className="hero-image">
          <div className="image-placeholder">
            <div className="product-showcase">
              <div className="product-grid">
                <div className="product-item">
                  <div className="product-image">🥑</div>
                  <span>Fresh Produce</span>
                </div>
                <div className="product-item">
                  <div className="product-image">🥖</div>
                  <span>Bakery</span>
                </div>
                <div className="product-item">
                  <div className="product-image">🥛</div>
                  <span>Dairy</span>
                </div>
                <div className="product-item">
                  <div className="product-image">🧴</div>
                  <span>Essentials</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="hero-content">
          <div className="content-wrapper">
            <h1 className="hero-title">Fresh & Local</h1>
            <p className="hero-subtitle">
              Discover quality products from your neighborhood store. Fresh
              groceries, household essentials, and friendly service.
            </p>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Free Delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span>Quality Guaranteed</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💳</span>
                <span>Secure Payment</span>
              </div>
            </div>
            <button className="cta-button">SHOP NOW</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
