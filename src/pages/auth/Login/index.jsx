import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../auth/firebase.js";
import api from "../../../api/axios.js";
import { useAuth } from "../../../auth/AuthContext";
import LoginView from "./view.jsx";

const Login = () => {
  const { setUserRole, setUserStatus } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Backend login (ONCE)
      const token = await userCredential.user.getIdToken(true);

      const res = await api.post(
        "/api/auth/login",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3️⃣ Store role & status in context
      setUserRole(res.data.user.role.toLowerCase());
      setUserStatus(res.data.user.status.toLowerCase());

      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(true);

      const res = await api.post(
        "/api/auth/login",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserRole(res.data.user.role.toLowerCase());
      setUserStatus(res.data.user.status.toLowerCase());
    } catch {
      setError("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView
      formData={{ email, password, rememberMe }}
      setFormData={{ setEmail, setPassword, setRememberMe }}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      error={error}
      loading={loading}
      handleLogin={handleLogin}
      handleGoogleSignIn={handleGoogleSignIn}
    />
  );
};

export default Login;
