"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "light" | "dark"
  className?: string
  showTagline?: boolean
}

export function Logo({ variant = "light", className, showTagline = true }: LogoProps) {
  const isDark = variant === "dark"

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group", className)}
      aria-label="BOGA - Ingeniería Portátil - Inicio"
    >
      {/* TODO: Reemplazar SVG inline con el logo BOGA oficial cuando esté disponible. */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="6" fill="#1b1341" />
        <circle cx="16" cy="16" r="12" fill="#2c4df2" />
        <path
          d="M16 6 C10 6 7 11 7 16 C7 21 10 25 16 25 C21 25 24 22 24 19 C24 16 21 15 18 15 C17 15 15 16 15 17 C15 19 17 19 18 19 C19 19 20 20 20 21 C20 22 18 23 16 23 C12 23 10 20 10 16 C10 12 13 9 16 9 C20 9 23 12 23 16 L26 16 C26 9 22 6 16 6 Z"
          fill="#ffffff"
        />
        <circle cx="22" cy="10" r="3" fill="#daf73a" />
      </svg>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-sans text-lg font-black leading-tight tracking-tight",
            isDark ? "text-white" : "text-[#1b1341]"
          )}
        >
          BOGA
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-sans text-[0.6rem] leading-tight tracking-[0.18em] uppercase",
              isDark ? "text-[#a8a3b8]" : "text-[#8a849d]"
            )}
          >
            Ingeniería Portátil
          </span>
        )}
      </div>
    </Link>
  )
}
