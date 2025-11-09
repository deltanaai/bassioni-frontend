import "./globals.css";
import { Geist, Geist_Mono as GeistMono } from "next/font/google";
import { Toaster } from "sonner";

import AuthGuard from "@/context/providers/authGuard";
import { QueryProvider } from "@/context/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Company Dashboard",
  description: "Manage company data, locations, warehouses, and employees.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
