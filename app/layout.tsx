import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎁 Amigo Secreto - Navidad 2024",
  description: "¡Descubre a quién le regalas esta Navidad! Sorteo de amigo secreto fácil y divertido.",
  keywords: ["amigo secreto", "navidad", "sorteo", "regalo", "intercambio"],
  authors: [{ name: "Tu Nombre" }],
  openGraph: {
    title: "🎁 Amigo Secreto - Navidad 2024",
    description: "¡Descubre a quién le regalas esta Navidad!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
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
        {children}
      </body>
    </html>
  );
}
