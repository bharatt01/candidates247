import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { app, db } from "@/firebase";

const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      // 🔥 Listen to the user document
      const userDocRef = doc(db, "users", currentUser.uid);

      unsubscribeSnapshot = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setUserRole(data.role || null);
          } else {
            setUserData(null);
            setUserRole(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Firestore snapshot error:", error);
          setUserData(null);
          setUserRole(null);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // ✅ SIGN UP
  const signUp = async (email, password, extraData = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // 🔥 Save user document with role
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: extraData.role || "user",
      fullName: extraData.fullName || "",
      phone: extraData.phone || "",
      companyName: extraData.companyName || "",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return cred;
  };

  // ✅ SIGN IN
  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ LOGOUT
  const logout = async () => {
    setUser(null);
    setUserData(null);
    setUserRole(null);
    return signOut(auth);
  };

  const value = {
    user,
    userData,
    userRole,
    signUp,
    signIn,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};