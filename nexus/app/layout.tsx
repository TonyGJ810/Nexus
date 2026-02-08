import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/toast";
import { CartProvider } from "@/context/CartContext";

export const dynamic = "force-dynamic";

const spaceGrotesk = localFont({
  src: "./fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus | Boletos para eventos premium",
  description: "Plataforma de venta de boletos para eventos premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ToastProvider>
          <CartProvider>
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 pt-20 pb-12">{children}</main>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
