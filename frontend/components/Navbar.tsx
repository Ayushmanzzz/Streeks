"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

  const pathname =
    usePathname();

  function isActive(
    path: string
  ) {
    return pathname === path;
  }

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">

      <nav
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-black/40
          p-2
          backdrop-blur-2xl
          shadow-[0_0_40px_rgba(0,0,0,0.35)]
        "
      >

        <div
          className="
            px-5
            py-3
            font-bold
            tracking-wide
            text-white
          "
        >
          STREEKS
        </div>

        <Link
          href="/"
          className={`
            rounded-full
            px-5
            py-3
            transition-all
            duration-300
            ${
              isActive("/")
                ? "bg-[#00E676]/10 text-[#00E676]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          Dashboard
        </Link>

        <Link
          href="/non-negotiables"
          className={`
            rounded-full
            px-5
            py-3
            transition-all
            duration-300
            ${
              pathname.startsWith(
                "/non-negotiables"
              )
                ? "bg-[#00E676]/10 text-[#00E676]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          Non-Negotiables
        </Link>

        <Link
          href="/tasks"
          className={`
            rounded-full
            px-5
            py-3
            transition-all
            duration-300
            ${
              pathname.startsWith(
                "/tasks"
              )
                ? "bg-[#00E676]/10 text-[#00E676]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          Tasks
        </Link>

        <Link
          href="/analytics"
          className={`
            rounded-full
            px-5
            py-3
            transition-all
            duration-300
            ${
              pathname.startsWith(
                "/analytics"
              )
                ? "bg-[#00E676]/10 text-[#00E676]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          Analytics
        </Link>

      </nav>

    </div>
  );
}