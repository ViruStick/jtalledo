"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface DashboardClientProps {
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-400 via-blue-300 to-purple-200">
      <Card className="w-full max-w-xs shadow-lg text-center mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
          <CardDescription className="text-base">
            Has iniciado sesión como <strong>{user.username}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.role === "admin" && (
            <Button
              onClick={() => router.push("/admin/users")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              Gestionar Usuarios
            </Button>
          )}

          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="secondary"
            className="w-full cursor-pointer"
          >
            {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
