"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import DisposicionForm from "@/components/DisposicionForm";
import { GradientCard } from "@/components/gradient-card";

interface HomeClientProps {
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
}

export default function HomeClient({ user }: HomeClientProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [subMenu, setSubMenu] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const templateMapping: Record<string, string> = {
    Archivo: "disposiciones/archivo",
  };

  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        subMenu={subMenu}
        setSubMenu={setSubMenu}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />
      <SidebarInset>
        <SiteHeader
          activeMenu={activeMenu}
          subMenu={subMenu}
          selectedDoc={selectedDoc}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">
          {activeMenu && subMenu === "archivo" && !selectedDoc ? (
            <div className="h-full flex flex-col">
              <button
                onClick={() => { setSubMenu(null); setActiveMenu(null); }}
                className="self-start flex items-center gap-1 text-sm mb-4 cursor-pointer"
              >
                <MdOutlineKeyboardArrowLeft />
                <p>Atrás</p>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Archivo", "Archivo liminar", "Consentida"].map((item) => (
                  <GradientCard key={item} onClick={() => setSelectedDoc(item)}>
                    {item}
                  </GradientCard>
                ))}
              </div>
            </div>
          ) : activeMenu && subMenu === "archivo" && selectedDoc ? (
            <div className="h-full flex flex-col">
              <button
                onClick={() => setSelectedDoc(null)}
                className="self-start flex items-center gap-1 text-sm mb-4 cursor-pointer"
              >
                <MdOutlineKeyboardArrowLeft />
                <p>Atrás</p>
              </button>
              {templateMapping[selectedDoc] ? (
                <DisposicionForm
                  templateSubdir={templateMapping[selectedDoc]}
                  title={selectedDoc}
                  userName={user.name}
                  onBack={() => {
                    setSelectedDoc(null);
                    setSubMenu(null);
                    setActiveMenu(null);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
                  Plantilla no disponible para &quot;{selectedDoc}&quot;
                </div>
              )}
            </div>
          ) : activeMenu && subMenu ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
              Plantilla no disponible para &quot;{subMenu}&quot;
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground h-full">
              <PanelLeft className="size-10" strokeWidth={1.5} />
              <p className="text-lg">Selecciona una opción del menú</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
