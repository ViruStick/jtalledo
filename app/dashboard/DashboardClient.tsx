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
import { LuLoaderCircle } from "react-icons/lu";

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-xs shadow-lg text-center mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Centro de Control
          </CardTitle>
          <CardDescription className="text-base">
            Has iniciado sesión como <strong>{user.username}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.role === "admin" && (
            <>
              <Button
                onClick={() => router.push("/home")}
                className="w-full gap-2 cursor-pointer"
              >
                Panel principal
              </Button>
              <Button
                onClick={() => router.push("/admin/users")}
                variant="outline"
                className="w-full gap-2 cursor-pointer"
              >
                Gestionar usuarios
              </Button>
            </>
          )}

          <Button
            onClick={handleLogout}
            variant="destructive"
            disabled={loggingOut}
            className="w-full cursor-pointer"
          >
            {loggingOut ? (
              <div className="flex items-center gap-2">
                <LuLoaderCircle className="animate-spin" />
                <p>Cerrando sesión...</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p>Cerrar sesión</p>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
