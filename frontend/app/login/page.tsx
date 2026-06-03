"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      window.location.href = "/";
    } catch {
      setError(
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
      <form
        onSubmit={handleLogin}
        className="
          w-full
          max-w-md
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          p-10
          backdrop-blur-xl
        "
      >
        <h1 className="mb-8 text-4xl font-bold">
          STREEKS
        </h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-black
              p-4
              outline-none
            "
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-black
              p-4
              outline-none
            "
          />
        </div>

        {error && (
          <p className="mb-4 text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-2xl
            bg-[#00E676]
            py-4
            font-semibold
            text-black
          "
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>
      </form>
    </main>
  );
}