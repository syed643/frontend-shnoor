import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import api from "../api/axios"; // axios instance with baseURL

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // 🔑 Get Firebase ID token
          const token = await user.getIdToken();

          // 🔐 ASK BACKEND (PostgreSQL)
          const res = await api.post("/api/auth/login", { token });

          setCurrentUser(user);
          setUserRole(res.data.user.role);
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("AuthContext backend sync failed:", error);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
