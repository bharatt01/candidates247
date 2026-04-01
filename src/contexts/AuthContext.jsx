import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { 
  doc, 
  onSnapshot, 
  getFirestore,
  setDoc
} from "firebase/firestore";
import { app } from "@/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      // 🔥 Listen to user document
      const userDocRef = doc(db, "users", currentUser.uid);

      unsubscribeSnapshot = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Firestore snapshot error:", error);
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

    // 🔥 Create user document
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: extraData.role || "user",
      fullName: extraData.fullName || "",
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
    return signOut(auth);
  };

  const userRole = userData?.role;

  const value = {
    user,
    userData,
    userRole,
    signUp,
    signIn,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};