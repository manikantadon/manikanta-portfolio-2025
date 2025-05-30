"use client";

import { useState, useTransition } from "react";
import { loginUser, registerUser } from "../lib/actions";
import { LoginCredentials, RegisterCredentials } from "../lib/types";
import toast from "react-hot-toast";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        if (mode === "register") {
          const credentials: RegisterCredentials = {
            email,
            password,
            confirmPassword,
          };

          toast.loading("Creating your account...", { id: "auth" });
          const result = await registerUser(credentials);

          if (result.success) {
            toast.success("Registration successful!", { id: "auth" });
            window.location.href = "/dashboard";
          } else {
            toast.error(result.message || "Registration failed", {
              id: "auth",
            });
            setError(result.message || "Registration failed");
          }
        } else {
          const credentials: LoginCredentials = {
            email,
            password,
          };

          toast.loading("Logging in...", { id: "auth" });
          const result = await loginUser(credentials);

          if (result.success) {
            toast.success("Login successful!", { id: "auth" });
            window.location.href = "/dashboard";
          } else {
            toast.error(result.message || "Login failed", { id: "auth" });
            setError(result.message || "Login failed");
          }
        }
      } catch (error) {
        toast.error("An unexpected error occurred", { id: "auth" });
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  mode === "register" ? "" : "rounded-b-md"
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>
            {mode === "register" && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Processing..."
                : mode === "login"
                ? "Sign in"
                : "Sign up"}
            </button>
          </div>

          <div className="text-center space-y-2">
            <span className="text-sm text-gray-600">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <a
                href={mode === "login" ? "/register" : "/login"}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </a>
            </span>
            {mode === "login" && (
              <div>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
