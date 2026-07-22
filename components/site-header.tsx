"use client"

import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface SiteHeaderProps {
  activeMenu: string | null
  subMenu: string | null
  selectedDoc: string | null
}

export function SiteHeader({ activeMenu, subMenu, selectedDoc }: SiteHeaderProps) {
  const menuLabels: Record<string, string> = {
    disposiciones: "Disposiciones",
    requerimientos: "Requerimientos",
    providencias: "Providencias",
    actas: "Actas",
    declaraciones: "Declaraciones",
    oficios: "Oficios",
    directorio: "Directorio",
  }

  const subMenuLabels: Record<string, string> = {
    archivo: "Archivo",
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/home">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          {activeMenu && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>{menuLabels[activeMenu] || activeMenu}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {subMenu && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>{subMenuLabels[subMenu] || subMenu}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {selectedDoc && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedDoc}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {!activeMenu && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Panel principal</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
