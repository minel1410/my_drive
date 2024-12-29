"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (password) => {
    const savedPassword = process.env.NEXT_PUBLIC_PASSWORD;


    console.log(password, savedPassword)

    if (password === savedPassword) {
      localStorage.setItem("authToken", "secure-token");
      setUser({ authenticated: true });
      router.push("/drive");
    } else {
      return{error: 'Wrong password'}
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
