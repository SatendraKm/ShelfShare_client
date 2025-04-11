"use client";
import { useEffect, useState } from "react";
import { createContext, useReducer, useContext } from "react";
import api from "@/lib/api";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider wrapper
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/profile/view`);
        dispatch({ type: "LOGIN", payload: res.data });
      } catch (err) {
        console.log("Not authenticated");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);
