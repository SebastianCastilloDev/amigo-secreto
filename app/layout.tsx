import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MusicaFondo } from "./componentes/MusicaFondo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎁 Amigo Secreto - Navidad 2025",
  description: "¡Descubre a quién le regalas esta Navidad! Sorteo de amigo secreto fácil y divertido para toda la familia.",
  keywords: ["amigo secreto", "navidad 2025", "sorteo", "regalo", "intercambio", "familia"],
  authors: [{ name: "Tu Nombre" }],
  openGraph: {
    title: "🎁 Amigo Secreto - Navidad 2025",
    description: "¡Descubre a quién le regalas esta Navidad!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MusicaFondo />
        {children}
      </body>
    </html>
  );
}
