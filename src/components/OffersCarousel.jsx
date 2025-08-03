import React, { useState, useEffect } from "react";
import "./OffersCarousel.css";

const OffersCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const offers = [
    {
      id: 1,
      title: "Fresh Produce Sale",
      discount: "20% OFF",
      description: "All fresh fruits and vegetables",
      image: "🥑",
      color: "#4CAF50",
    },
    {
      id: 2,
      title: "Bakery Special",
      discount: "15% OFF",
      description: "Fresh bread and pastries",
      image: "🥖",
      color: "#FF9800",
    },
    {
      id: 3,
      title: "Dairy Products",
      discount: "25% OFF",
      description: "Milk, cheese, and yogurt",
      image: "🥛",
      color: "#2196F3",
    },
    {
      id: 4,
      title: "Household Essentials",
      discount: "30% OFF",
      description: "Cleaning and personal care",
      image: "🧴",
      color: "#9C27B0",
    },
    {
      id: 5,
      title: "Snacks & Beverages",
      discount: "10% OFF",
      description: "Chips, drinks, and more",
      image: "🥤",
      color: "#F44336",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <section className="offers-section">
      <div className="offers-container">
        <div className="offers-header">
          <h2>Special Offers</h2>
          <p>Limited time deals on your favorite products</p>
        </div>

        <div className="carousel-container">
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            ‹
          </button>

          <div className="carousel-track">
            <div
              className="carousel-slide"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="offer-card"
                  style={{ "--offer-color": offer.color }}>
                  <div className="offer-image">
                    <span className="offer-emoji">{offer.image}</span>
                  </div>
                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
                    <div className="offer-discount">{offer.discount}</div>
                    <p className="offer-description">{offer.description}</p>
                    <button className="offer-btn">Shop Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn next-btn" onClick={nextSlide}>
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {offers.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersCarousel;
