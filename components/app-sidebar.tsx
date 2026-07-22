"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MdOutlineDescription,
  MdOutlineAssignment,
  MdOutlinePendingActions,
  MdOutlineNoteAdd,
  MdOutlineDashboard,
  MdOutlineContactMail,
} from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { BsClipboard2Check } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { Monitor } from "lucide-react";

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  subMenu: string | null;
  setSubMenu: (menu: string | null) => void;
  selectedDoc: string | null;
  setSelectedDoc: (doc: string | null) => void;
  user: {
    name: string;
    username: string;
    role: string;
  };
}

export function AppSidebar({
  activeMenu,
  setActiveMenu,
  subMenu,
  setSubMenu,
  selectedDoc,
  setSelectedDoc,
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="JTF">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Monitor className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">JTF</span>
                <span className="truncate text-xs">Sistema de Plantillas</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={activeMenu === "disposiciones"}
                onOpenChange={(open) => {
                  if (open) {
                    setActiveMenu("disposiciones");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }
                }}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger render={<div />} nativeButton={false}>
                    <SidebarMenuButton
                      isActive={activeMenu === "disposiciones"}
                      tooltip="Disposiciones"
                    >
                      <HiOutlineDocumentText />
                      <span>Disposiciones</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menuDisposiciones.map((item) => (
                        <SidebarMenuSubItem key={item}>
                          <SidebarMenuSubButton
                            isActive={subMenu === item.toLowerCase()}
                            onClick={() => {
                              setSubMenu(item.toLowerCase());
                              setSelectedDoc(null);
                            }}
                          >
                            <span>{item}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible
                open={activeMenu === "requerimientos"}
                onOpenChange={(open) => {
                  if (open) {
                    setActiveMenu("requerimientos");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }
                }}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger render={<div />} nativeButton={false}>
                    <SidebarMenuButton
                      isActive={activeMenu === "requerimientos"}
                      tooltip="Requerimientos"
                    >
                      <MdOutlinePendingActions />
                      <span>Requerimientos</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menuRequerimientos.map((item) => (
                        <SidebarMenuSubItem key={item}>
                          <SidebarMenuSubButton
                            isActive={subMenu === item.toLowerCase()}
                            onClick={() => {
                              setSubMenu(item.toLowerCase());
                              setSelectedDoc(null);
                            }}
                          >
                            <span>{item}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "providencias"}
                  onClick={() => {
                    setActiveMenu("providencias");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }}
                  tooltip="Providencias"
                >
                  <MdOutlineNoteAdd />
                  <span>Providencias</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "actas"}
                  onClick={() => {
                    setActiveMenu("actas");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }}
                  tooltip="Actas"
                >
                  <BsClipboard2Check />
                  <span>Actas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "declaraciones"}
                  onClick={() => {
                    setActiveMenu("declaraciones");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }}
                  tooltip="Declaraciones"
                >
                  <MdOutlineDescription />
                  <span>Declaraciones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "oficios"}
                  onClick={() => {
                    setActiveMenu("oficios");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }}
                  tooltip="Oficios"
                >
                  <MdOutlineContactMail />
                  <span>Oficios</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeMenu === "directorio"}
                  onClick={() => {
                    setActiveMenu("directorio");
                    setSubMenu(null);
                    setSelectedDoc(null);
                  }}
                  tooltip="Directorio"
                >
                  <FaUserGroup />
                  <span>Directorio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <NavUser user={user} />
    </Sidebar>
  );
}
