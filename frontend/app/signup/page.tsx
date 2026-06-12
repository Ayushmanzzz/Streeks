"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";

import { signup } from "@/services/auth";

export default function SignupPage() {

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (token) {
      window.location.href = "/";
    }

  }, []);

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {

      if (!username.trim()) {
        alert(
          "Username is required"
        );
        return;
      }

      if (!email.trim()) {
        alert(
          "Email is required"
        );
        return;
      }

      if (!password.trim()) {
        alert(
          "Password is required"
        );
        return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      await signup(
        username,
        email,
        password
      );

      setSuccess(
        "Account created successfully. Sign in now."
      );

      setUsername("");
      setEmail("");
      setPassword("");

    } catch {

      setError(
        "Failed to create account"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">

      <form
        onSubmit={handleSignup}
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
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="
            mb-4
            w-full
            rounded-2xl
            border
            border-white/10
            bg-black
            p-4
          "
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="
            mb-4
            w-full
            rounded-2xl
            border
            border-white/10
            bg-black
            p-4
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            mb-4
            w-full
            rounded-2xl
            border
            border-white/10
            bg-black
            p-4
          "
        />

        {error && (
          <p className="mb-4 text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 text-[#00E676]">
            {success}
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
            ? "Creating..."
            : "Create Account"}
        </button>

        <div className="mt-6 text-center text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="
              text-[#00E676]
              hover:underline
            "
          >
            Sign In
          </Link>
        </div>

      </form>

    </main>
  );
}