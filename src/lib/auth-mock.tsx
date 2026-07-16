"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { loginAdmin } from "@/app/admin/login/actions"

interface MockUser {
  id: string
  email: string
  name: string
  role: "ADMIN"
}

interface AuthMockContextValue {
  user: MockUser | null
  status: "authenticated" | "unauthenticated"
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthMockContext = createContext<AuthMockContextValue | null>(null)

const MOCK_USER: MockUser = {
  id: "usr_1",
  email: "admin@junisama.com",
  name: "Administrador BOGA",
  role: "ADMIN",
}

export function AuthMockProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [status, setStatus] = useState<"authenticated" | "unauthenticated">(
    "unauthenticated"
  )

  const signIn = async (email: string, password: string) => {
    const ok = await loginAdmin(email, password)

    if (ok) {
      setUser({ ...MOCK_USER, email })
      setStatus("authenticated")
      return true
    }
    return false
  }

  const signOut = () => {
    setUser(null)
    setStatus("unauthenticated")
  }

  return (
    <AuthMockContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthMockContext.Provider>
  )
}

export function useAuthMock() {
  const ctx = useContext(AuthMockContext)
  if (!ctx) {
    throw new Error("useAuthMock must be used within AuthMockProvider")
  }
  return ctx
}
