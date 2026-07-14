"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa";
import { TbLogin } from "react-icons/tb";
import { LuLoaderCircle } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaCamera } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import DisposicionForm from "@/components/DisposicionForm";

interface HomeClientProps {
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
}

export default function HomeClient({ user }: HomeClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [avatarsList, setAvatarsList] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [subMenu, setSubMenu] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const templateMapping: Record<string, string> = {
    Archivo: "disposiciones/archivo",
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.avatar) setAvatar(data.user.avatar);
      })
      .catch(() => {});
  }, []);

  const openPicker = async () => {
    setSelectedAvatar(avatar);
    setShowPicker(true);
    if (avatarsList.length === 0) {
      try {
        const res = await fetch("/api/avatars");
        const data = await res.json();
        setAvatarsList(data.avatars);
      } catch {}
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });
      if (res.ok) {
        setAvatar(selectedAvatar);
        setShowPicker(false);
        setLoading(false);
      }
    } catch {}
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const menuDisposiciones = [
    "Apertura",
    "Ampliación",
    "Formalización",
    "Conclusión",
    "Archivo",
    "Elevación de actuados",
    "Derivación",
    "Acumulación",
    "Impulso",
  ];

  const menuRequerimientos = [
    "Detención preliminar",
    "Prisión preventiva",
    "Prolongación de prisión preventiva",
    "Levantamiento del secreto de las comunicaciones",
    "Levantamiento del secreto bancario",
    "Acusación",
    "Sobreseimiento",
    "Terminación anticipada",
    "Conclusión anticipada",
  ];

  return (
    <div className="m-4 2xl:m-8 rounded-4xl overflow-hidden h-[calc(100vh-2rem)] 2xl:h-[calc(100vh-4rem)] bg-gray-200 grid grid-cols-[280px_1fr]">
      <aside className="bg-gray-200 flex flex-col h-full">
        <nav className="bg-white rounded-2xl flex-1 p-4 2xl:p-6 mx-3 mt-3">
          <h2 className="text-2xl font-bold mb-4">Menú</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveMenu("disposiciones");
                setSubMenu(null);
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                activeMenu === "disposiciones"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              Disposiciones
            </button>
            <button
              onClick={() => {
                setActiveMenu("requerimientos");
                setSubMenu(null);
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                activeMenu === "requerimientos"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              Requerimientos
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              Providencias
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              Actas
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              Declaraciones
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              Oficios
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer">
              Directorio
            </button>
          </div>
        </nav>

        <div className="flex justify-center gap-8 bg-white rounded-2xl p-3 m-3">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={openPicker}
              className="relative group cursor-pointer"
            >
              {avatar ? (
                <img
                  src={`/avatars/${avatar}`}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-5xl text-gray-400" />
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaCamera className="text-white text-lg" />
              </div>
            </button>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-1">
            {user.role === "admin" && (
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full gap-1 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                <MdOutlineKeyboardArrowLeft />
                <p className="text-xs">Centro control</p>
              </Button>
            )}

            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full bg-red-600 hover:bg-red-500 text-white cursor-pointer text-sm"
            >
              {loggingOut ? (
                <div className="flex items-center gap-1">
                  <LuLoaderCircle className="animate-spin" />
                  <p className="text-xs">Cerrando sesión...</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <TbLogin />
                  <p className="text-xs">Cerrar sesión</p>
                </div>
              )}
            </Button>
          </div>
        </div>
      </aside>

      <main className="bg-white my-3 mr-3 rounded-2xl p-6">
        {activeMenu === "disposiciones" &&
        subMenu === "archivo" &&
        !selectedDoc ? (
          <div className="h-full flex flex-col">
            <button
              onClick={() => setSubMenu(null)}
              className="self-start flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer"
            >
              <MdOutlineKeyboardArrowLeft />
              <p>Atrás</p>
            </button>
            <div className="grid grid-cols-3 gap-4">
              {["Archivo", "Archivo liminar", "Consentida"].map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedDoc(item)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 text-xl font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : activeMenu === "disposiciones" &&
          subMenu === "archivo" &&
          selectedDoc ? (
          <div className="h-full flex flex-col">
            <button
              onClick={() => setSelectedDoc(null)}
              className="self-start flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 cursor-pointer"
            >
              <MdOutlineKeyboardArrowLeft />
              <p>Atrás</p>
            </button>
            {templateMapping[selectedDoc] ? (
              <DisposicionForm
                templateSubdir={templateMapping[selectedDoc]}
                title={selectedDoc}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                Plantilla no disponible para "{selectedDoc}"
              </div>
            )}
          </div>
        ) : activeMenu === "disposiciones" ? (
          <div className="grid grid-cols-3 gap-4 h-full">
            {menuDisposiciones.map((disposicion) => (
              <button
                key={disposicion}
                onClick={() => {
                  if (disposicion === "Archivo") {
                    setSubMenu("archivo");
                  }
                }}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 text-xl font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
              >
                {disposicion}
              </button>
            ))}
          </div>
        ) : activeMenu === "requerimientos" ? (
          <div className="grid grid-cols-3 gap-4 h-full">
            {menuRequerimientos.map((requerimiento) => (
              <button
                key={requerimiento}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 text-xl font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
              >
                {requerimiento}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-400 text-lg h-full">
            Selecciona una opción del menú
          </div>
        )}
      </main>

      <AlertDialog
        open={showPicker}
        onOpenChange={(open) => !open && setShowPicker(false)}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Selecciona tu avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Elige una imagen para tu perfil o selecciona "Ninguno"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-4 gap-3 py-4 max-h-100 overflow-y-auto">
            <button
              onClick={() => setSelectedAvatar(null)}
              className={cn(
                "flex items-center justify-center aspect-square rounded-full border-2 transition-all cursor-pointer",
                selectedAvatar === null
                  ? "border-blue-600 ring-2 ring-blue-400 bg-blue-50"
                  : "border-dashed border-gray-300 hover:border-gray-400 bg-gray-50",
              )}
            >
              <span className="text-xs font-medium text-gray-500">Ninguno</span>
            </button>
            {avatarsList.map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedAvatar(filename)}
                className={cn(
                  "rounded-full overflow-hidden aspect-square cursor-pointer border-2 transition-all hover:border-blue-500",
                  selectedAvatar === filename
                    ? "border-blue-600 ring-2 ring-blue-400"
                    : "border-transparent",
                )}
              >
                <img
                  src={`/avatars/${filename}`}
                  alt={filename}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={handleSave}
              disabled={selectedAvatar === avatar || loading}
              className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <LuLoaderCircle className="animate-spin" />
                  <p>Guardando...</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <p>Guardar</p>
                </div>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
