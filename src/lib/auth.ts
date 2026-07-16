export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.warn(
      "[auth] ADMIN_EMAIL o ADMIN_PASSWORD no están configuradas en las variables de entorno."
    )
    return false
  }

  return (
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    password === adminPassword
  )
}
