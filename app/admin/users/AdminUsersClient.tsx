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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
import { FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { PiPasswordBold } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersClient() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    });

    if (res.ok) {
      toast.success(`Usuario "${username}" creado correctamente`);
      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al crear usuario");
    }
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const handleEdit = (user: User) => {
    setEditTarget(user);
    setEditName(user.name);
    setEditUsername(user.username);
  };

  const confirmEdit = async () => {
    if (!editTarget) return;

    const res = await fetch("/api/auth/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editTarget.id,
        name: editName,
        username: editUsername,
      }),
    });

    if (res.ok) {
      toast.success(`Usuario "${editUsername}" actualizado correctamente`);
      setEditTarget(null);
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al editar usuario");
    }
  };

  const handleResetPass = (user: User) => {
    setResetTarget(user);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const confirmReset = async () => {
    if (!resetTarget) return;

    if (newPassword !== confirmNewPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch("/api/auth/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: resetTarget.id, password: newPassword }),
    });

    if (res.ok) {
      toast.success(`Contraseña restablecida para "${resetTarget.username}"`);
      setResetTarget(null);
    } else {
      const data = await res.json();
      toast.error(data.error || "Error al restablecer contraseña");
    }
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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Gestión de Usuarios
          </h1>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            className="w-full sm:w-auto cursor-pointer"
          >
            <FaArrowLeft />
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
                  <Label htmlFor="new-name">Nombre</Label>
                  <Input
                    id="new-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                    required
                  />
                </div>
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
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LuLoaderCircle className="animate-spin mb-0.5" />
                      <p>Creando usuario...</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaPlus className="mb-0.5" />
                      <p>Crear Usuario</p>
                    </div>
                  )}
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
                <div className="space-y-3 max-h-90 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-row items-center justify-between p-3 bg-muted rounded-xl"
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground">
                            Nombre:{" "}
                          </span>
                          <span className="font-semibold text-sm">
                            {user.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-muted-foreground">
                            Usuario:{" "}
                          </span>
                          <span className="font-semibold text-sm">
                            {user.username}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-muted-foreground">
                            Permiso:{" "}
                          </span>
                          <Badge
                            className={`text-sm px-1.5 py-2.5 rounded-sm ${
                              user.role === "admin"
                                ? "bg-green-600 text-white"
                                : "bg-indigo-600 text-white"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Usuario"}
                          </Badge>
                        </div>
                      </div>
                      {user.role !== "admin" && (
                        <div className="flex flex-col gap-1">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="bg-blue-600 w-7 h-7 flex justify-center items-center rounded-full cursor-pointer"
                                />
                              }
                            >
                              <RiEdit2Fill className="text-white w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent>Editar usuario</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <button
                                  onClick={() => handleResetPass(user)}
                                  className="bg-green-600 w-7 h-7 flex justify-center items-center rounded-full cursor-pointer"
                                />
                              }
                            >
                              <PiPasswordBold className="text-white w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent>Resetear Contraseña</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="bg-red-600 w-7 h-7 flex justify-center items-center rounded-full cursor-pointer"
                                />
                              }
                            >
                              <MdDelete className="text-white w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent>Eliminar usuario</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar a{" "}
              <strong>{deleteTarget?.username}</strong>? Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restablecer Contraseña</AlertDialogTitle>
            <AlertDialogDescription>
              Nueva contraseña para <strong>{resetTarget?.name}</strong>{" "}
              <strong>{resetTarget?.username}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-pass">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-pass"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                  {showNewPassword ? (
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
              <Label htmlFor="new-confirm-pass">Repetir Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-confirm-pass"
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repetir contraseña"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                >
                  {showConfirmNewPassword ? (
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
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="default"
              onClick={confirmReset}
              className="text-white cursor-pointer"
            >
              Guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Editando a <strong>{editTarget?.name}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">Usuario</Label>
              <Input
                id="edit-username"
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Nombre de usuario"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEdit}
              className="bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
            >
              Guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
