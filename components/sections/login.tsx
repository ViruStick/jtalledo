"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { TbLogin2 } from "react-icons/tb";

function Login() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true) }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Bienvenido " + (data.user.name || data.user.username));
        if (data.user.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/home");
        }
      } else {
        toast.error(data.error || "Error al iniciar sesión");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 rounded-full border border-border bg-background text-foreground hover:bg-muted cursor-pointer z-50"
      >
        {mounted ? (theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )) : (
          <div className="h-5 w-5" />
        )}
      </button>

      <Card className="w-full max-w-sm shadow-lg mx-4 relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center justify-center gap-4">
              <img src="/icons/dota2.svg" alt="logo" className="w-10" />
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col">
                <span className="font-bold text-xl">Bienvenido</span>
                <span className="text-sm">
                  Ingresa tus datos para iniciar sesión
                </span>
              </div>
              <div className="bg-muted flex flex-col items-center justify-center p-4 rounded-2xl text-center w-full border border-border mt-4">
                <span className="font-semibold text-sm">
                  "La automatización no reemplaza el criterio.
                </span>
                <span className="font-semibold text-sm">
                  No todos los procesos tienen que ser iguales; algunos pueden
                  ser mejores."
                </span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuario</Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="ID de usuario"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="recordarme" />
              <Label
                htmlFor="recordarme"
                className="text-sm font-normal text-muted-foreground"
              >
                Recordarme
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LuLoaderCircle className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center">Iniciar sesión</div>
              )}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>¿No tienes una cuenta?</p>
            <div className="text-foreground font-semibold flex items-center justify-center gap-2">
              ¡Qué Pena! 😔 Esto no es para todos...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
