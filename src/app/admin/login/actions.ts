"use server"

import { verifyAdminCredentials } from "@/lib/auth"

export async function loginAdmin(email: string, password: string): Promise<boolean> {
  return verifyAdminCredentials(email, password)
}
