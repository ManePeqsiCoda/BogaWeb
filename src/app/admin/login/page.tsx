"use client"

import { Suspense, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAuthMock } from "@/lib/auth-mock"
import { siteConfig } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "Mínimo 6 caracteres"),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const { signIn } = useAuthMock()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginForm) => {
    setError("")
    const ok = await signIn(data.email, data.password)
    if (ok) {
      router.push("/admin")
      router.refresh()
    } else {
      setError("Credenciales inválidas. Inténtalo de nuevo.")
    }
  }

  return (
    <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-xl">
          B
        </div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wider text-foreground">
          Panel de Administración
        </h1>
        <CardDescription className="text-muted-foreground">
          Inicia sesión para gestionar BOGA
        </CardDescription>
        <div className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-left">
          <p className="text-xs text-muted-foreground">
            <strong>Acceso demo:</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            {siteConfig.admin.email} / {siteConfig.admin.password}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full text-xs"
            onClick={() => {
              setValue("email", siteConfig.admin.email)
              setValue("password", siteConfig.admin.password)
            }}
          >
            Autocompletar credenciales
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert
              variant="destructive"
              className="border-error/30 bg-error-bg text-error"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-error">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense
        fallback={
          <div className="h-64 w-full max-w-md animate-pulse rounded-xl bg-card" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
