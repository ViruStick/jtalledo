import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JTF",
  description: "Sistema de gestión",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <img
          src="/images/fondo-login.webp"
          alt=""
          className="fixed top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/20 z-1" />
        <TooltipProvider>
          <main className="relative z-2">{children}</main>
        </TooltipProvider>
        <Toaster position="top-right" theme="light" duration={2000} />
      </body>
    </html>
  );
}
