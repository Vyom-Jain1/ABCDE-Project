const API_BASE_URL = "http://localhost:8080/api";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const makeRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const userAPI = {
  signup: async (userData) => {
    return makeRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return makeRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getUsers: async () => {
    return makeRequest("/users");
  },
};

export const itemsAPI = {
  getItems: async () => {
    return makeRequest("/items");
  },

  createItem: async (itemData) => {
    return makeRequest("/items", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },
};

export const cartAPI = {
  addToCart: async (itemId) => {
    return makeRequest("/carts", {
      method: "POST",
      body: JSON.stringify({ item_id: itemId }),
    });
  },

  getCart: async () => {
    return makeRequest("/carts");
  },
};

export const ordersAPI = {
  createOrder: async (cartId) => {
    return makeRequest("/orders", {
      method: "POST",
      body: JSON.stringify({ cart_id: cartId }),
    });
  },

  getOrders: async () => {
    return makeRequest("/orders");
  },
};

export const authUtils = {
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  setUser: (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
  },
};
