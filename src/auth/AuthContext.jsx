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
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setUserRole(null);
        setUserStatus(null);
        setLoading(false);
        return;
      }

      // ✅ ONLY trust Firebase here
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRole(null);
    setUserStatus(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userRole, userStatus, loading, logout, setUserRole, setUserStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}
