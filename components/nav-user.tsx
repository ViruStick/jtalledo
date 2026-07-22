"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { LuLoaderCircle, LuLogOut } from "react-icons/lu";
import { FaCamera } from "react-icons/fa6";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { HiChevronUpDown } from "react-icons/hi2";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavUserProps {
  user: {
    name: string;
    username: string;
    role: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [avatarsList, setAvatarsList] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="p-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<div />}>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={avatar ? `/avatars/${avatar}` : undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.role === "admin" ? "Administrador" : "Usuario"}
                  </span>
                </div>
                <HiChevronUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage
                        src={avatar ? `/avatars/${avatar}` : undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.role === "admin" ? "Administrador" : "Usuario"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {mounted &&
                    (theme === "dark" ? (
                      <MdOutlineLightMode />
                    ) : (
                      <MdOutlineDarkMode />
                    ))}
                  {theme === "dark" ? "Modo claro" : "Modo oscuro"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={openPicker}>
                  <FaCamera />
                  Cambiar avatar
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={loggingOut}
                variant="destructive"
              >
                {loggingOut ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  <LuLogOut />
                )}
                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AlertDialog
        open={showPicker}
        onOpenChange={(open) => !open && setShowPicker(false)}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Selecciona tu avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Elige una imagen para tu perfil o selecciona &quot;Ninguno&quot;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="overflow-y-auto py-4" style={{ maxHeight: "24rem" }}>
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => setSelectedAvatar(null)}
                className={cn(
                  "flex items-center justify-center aspect-square rounded-full border-2 transition-all cursor-pointer",
                  selectedAvatar === null
                    ? "border-primary ring-2 ring-primary/50 bg-primary/10"
                    : "border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 bg-muted",
                )}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  Ninguno
                </span>
              </button>
              {avatarsList.map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedAvatar(filename)}
                  className={cn(
                    "rounded-full overflow-hidden aspect-square cursor-pointer border-2 transition-all hover:border-primary",
                    selectedAvatar === filename
                      ? "border-primary ring-2 ring-primary/50"
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
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={handleSave}
              disabled={selectedAvatar === avatar || loading}
              className="cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <LuLoaderCircle className="animate-spin" />
                  <p>Guardando...</p>
                </div>
              ) : (
                <p>Guardar</p>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
