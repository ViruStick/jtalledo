"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersClient() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/auth/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch("/api/auth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      toast.success(`Usuario "${username}" creado correctamente`);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al crear usuario");
    }
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const res = await fetch("/api/auth/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });

    if (res.ok) {
      toast.success(`Usuario "${deleteTarget.username}" eliminado`);
      setDeleteTarget(null);
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al eliminar usuario");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-300 to-purple-200 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            className="w-full sm:w-auto cursor-pointer"
          >
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
          <Card className="col-span-1 md:col-span-5">
            <CardHeader>
              <CardTitle className="text-blue-600 font-bold text-lg">
                Crear Nuevo Usuario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username">Usuario</Label>
                  <Input
                    id="new-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
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
                <div className="space-y-2">
                  <Label htmlFor="new-confirm-password">
                    Repetir Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetir contraseña"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    >
                      {showConfirmPassword ? (
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
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Crear Usuario
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <p className="text-blue-600 font-bold text-lg">
                  Usuarios Registrados
                </p>
                <Badge className="bg-gray-800 w-6 h-6 font-bold">
                  {users.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay usuarios registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-row items-center justify-between p-3 bg-muted rounded-xl"
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-sm">
                          {user.username}
                        </span>
                        <Badge
                          className={`text-xs px-1 py-1 rounded-sm ${
                            user.role === "admin"
                              ? "bg-green-600 text-white"
                              : "bg-indigo-600 text-white"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Usuario"}
                        </Badge>
                      </div>
                      {user.role !== "admin" && (
                        <Button
                          onClick={() => handleDelete(user)}
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar a <strong>{deleteTarget?.username}</strong>? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
