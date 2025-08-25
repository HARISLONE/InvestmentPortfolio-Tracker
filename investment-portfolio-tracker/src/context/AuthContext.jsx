import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async () => { 
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code === "auth/operation-not-allowed") {
        alert("Google sign-in is disabled for this project. Enable it in Firebase Console → Authentication → Sign-in method.");
      } else if (e.code === "auth/popup-blocked") {
        alert("Your browser blocked the sign-in popup. Please allow popups or try again.");
      } else {
        alert(`Sign-in failed: ${e.code || e.message}`);
      }
  }
  };
  
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/"); // redirect to homepage
  };


  return (
    <AuthCtx.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
