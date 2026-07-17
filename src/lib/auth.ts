import { siteConfig } from "@/lib/site"

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = siteConfig.admin.email
  const adminPassword = siteConfig.admin.password

  return (
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    password === adminPassword
  )
}
