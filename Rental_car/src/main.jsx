import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { router } from "./routes/Routes";

import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./DB/FirebaseConfig";

// ── Contexts ──────────────────────────────────────────────
export const CarContext = createContext();
export const AuthContext = createContext();

// ── Auth Provider ─────────────────────────────────────────
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(() => {
    // Hydrate role instantly from localStorage to avoid navbar flicker
    if (localStorage.getItem("adminUser")) return "admin";
    return localStorage.getItem("userRole") || null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    // Check for admin session in localStorage first
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const parsed = JSON.parse(adminUser);
      setCurrentUser(parsed);
      setRole("admin");
      setAuthLoading(false);
      return;
    }

    // Listen to Firebase Auth for regular users
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          const userRole = snap.exists() && snap.data().role ? snap.data().role : "user";
          setRole(userRole);
          // cache role so navbar is instant on reload
          localStorage.setItem("userRole", userRole);
        } catch {
          setRole("user");
          localStorage.setItem("userRole", "user");
        }
      } else {
        setCurrentUser(null);
        setRole(null);
        localStorage.removeItem("userRole");
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Admin login — sets state directly so navbar updates instantly
  const loginAsAdmin = (adminData) => {
    localStorage.setItem("adminUser", JSON.stringify(adminData));
    setCurrentUser(adminData);
    setRole("admin");
  };

  // Single logout function — handles both admin and regular users
  const logout = async () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
    setRole(null);
    try {
      await signOut(auth);
    } catch {
      // ignore if no Firebase session
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, authLoading, logout, loginAsAdmin, loginDialogOpen, setLoginDialogOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Car Provider ──────────────────────────────────────────
const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Real-time listener — rating, ratingCount, availability update instantly
    const unsub = onSnapshot(collection(db, "Carsdb"), (snap) => {
      setCars(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Cars listener error:", err);
    });
    return () => unsub();
  }, []);

  return (
    <CarContext.Provider value={{ cars, setCars }}>
      {children}
    </CarContext.Provider>
  );
};

// ── Render ────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CarProvider>
        <RouterProvider router={router} />
      </CarProvider>
    </AuthProvider>
  </React.StrictMode>
);
