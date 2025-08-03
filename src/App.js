import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import OffersCarousel from "./components/OffersCarousel";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { authUtils } from "./services/api";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (user && authUtils.isAuthenticated()) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (userData) => {
    authUtils.setUser(userData);
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleSignup = (userData) => {
    authUtils.setUser(userData);
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const switchToSignup = () => {
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        {showSignup ? (
          <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
        ) : (
          <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <Header onLogout={handleLogout} user={currentUser} />
      <main className="main-content">
        <Hero />
        <OffersCarousel />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
