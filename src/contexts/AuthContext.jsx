import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();

            setUser({
              uid: firebaseUser.uid,   // ✅ FIXED (was id)
              email: firebaseUser.email,
              fullName: data.fullName || "",
              role: data.role || null
            });

          } else {
            // Create new user document if not exists
            const userData = {
              email: firebaseUser.email,
              role: null,
              fullName: "",
              createdAt: new Date()
            };

            await setDoc(userRef, userData);

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            });
          }

        } catch (error) {
          console.error("Auth fetch error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 LOGIN
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // 🆕 SIGNUP
  const signUp = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        role: userData.role,
        fullName: userData.fullName || "",
        createdAt: new Date()
      });

      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(`Signup failed: ${error.message}`);
      throw error;
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔗 HOOK
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};