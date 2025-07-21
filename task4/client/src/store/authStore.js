import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Function to get stored auth data
const getStoredAuth = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["auth"], (result) => {
      if (result.auth) {
        const { user, expiresAt } = result.auth;
        // Check if the token is still valid
        if (expiresAt && new Date().getTime() < expiresAt) {
          resolve({ user, isAuthenticated: true });
        } else {
          chrome.storage.local.remove(["auth"]);
          resolve({ user: null, isAuthenticated: false });
        }
      } else {
        resolve({ user: null, isAuthenticated: false });
      }
    });
  });
};

// Function to store auth data
const storeAuth = (user) => {
  const expiresAt = new Date().getTime() + 28 * 24 * 60 * 60 * 1000; // 28 days from now
  chrome.storage.local.set({
    auth: { user, expiresAt },
  });
};

// Function to clear auth data
const clearAuth = () => {
  chrome.storage.local.remove(["auth"]);
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true since we'll check storage
  error: null,

  // Initialize auth state from storage
  init: async () => {
    const stored = await getStoredAuth();
    set({
      user: stored.user,
      isAuthenticated: stored.isAuthenticated,
      isLoading: false,
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      const user = response.data.user;
      storeAuth(user); // Store auth data
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/register`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } finally {
      // Only clear auth data, keep activity data for next login
      chrome.storage.local.remove(["auth"]);
      set({ user: null, isAuthenticated: false });
    }
  },
}));
