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
import { TbLogin } from "react-icons/tb";
import { LuLoaderCircle } from "react-icons/lu";
import { HiUsers } from "react-icons/hi";
import { MdEditDocument } from "react-icons/md";

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
                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                <MdEditDocument />
                Ir al Menu Principal
              </Button>
              <Button
                onClick={() => router.push("/admin/users")}
                className="w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                <HiUsers />
                Gestionar Usuarios
              </Button>
            </>
          )}

          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full bg-red-600 hover:bg-red-500 text-white cursor-pointer"
          >
            {loggingOut ? (
              <div className="flex items-center gap-2">
                <LuLoaderCircle className="animate-spin" />
                <p>Cerrando sesión...</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TbLogin />
                <p>Cerrar sesión</p>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
