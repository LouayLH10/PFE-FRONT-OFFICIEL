"use client";

import { jwtDecode } from "jwt-decode";

interface JwtUser {
  sub: number;
  email: string;
  name: string;
  language:string;
}

export const getUserFromToken = (): JwtUser | null => {
  // ✅ éviter erreur SSR
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<JwtUser>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};