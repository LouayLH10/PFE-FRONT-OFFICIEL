"use client";

import { useState } from "react";
import Link from "next/link";
import { loginService } from "../services/loginService";
import { getUserFromToken } from "../pages/login/user";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginService(email, password);

      console.log(data);
      setError("");
      setSuccess("Connected");
      localStorage.setItem("token", data.access_token);
      const user = getUserFromToken();
      console.log(user?.sub);   
      console.log(user?.email); 
      console.log(user?.name); 
           router.push("/features/dashboard/pages");

    } catch (err) {
      console.error(err);
      setSuccess("");
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm">{success}</p>
          )}

          <p className="text-sm">
            You don't have an account?{" "}
            <Link
              href="/features/auth/pages/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>

          <p className="text-sm">
            <Link
              href="/features/auth/pages/forgotpassword"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
