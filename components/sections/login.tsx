"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
              <div className="bg-gray-50 flex flex-col items-center justify-center p-4 rounded-2xl text-center w-full border border-gray-200 mt-4">
                <span className="font-semibold text-sm">
                  "La automatización no reemplaza el criterio
                </span>
                <span className="font-semibold text-sm">
                  no todos los procesos tienen que ser iguales: algunos pueden
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LuLoaderCircle className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TbLogin2 className="w-5 h-5" />
                  Iniciar Sesión
                </div>
              )}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>¿No tienes una cuenta?</p>
            <div className="text-gray-800 font-semibold flex items-center justify-center gap-2">
              ¡Qué Pena! 😔
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
