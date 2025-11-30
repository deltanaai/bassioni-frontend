import "./globals.css";
import { Geist, Geist_Mono as GeistMono } from "next/font/google";
import { Toaster } from "sonner";

import AuthGuard from "@/context/providers/authGuard";
import { QueryProvider } from "@/context/providers/query-provider";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const sessionCookie = (await cookies()).get("session")?.value;

  if (!sessionCookie) {
    return {
      title: "Dashboard",
    };
  }

  let session: Session | null = null;

  try {
    session = JSON.parse(sessionCookie);
  } catch (e) {
    console.error("Invalid session cookie", e);
  }

  const user = session?.user;

  if (!user) {
    return { title: "Dashboard" };
  }

  let dashboardName = user?.name ?? "Dashboard";

  if (user.company) {
    dashboardName = ` شركة - ${user.company.name}`;
  } else if (user.pharmacy) {
    dashboardName = `صيدلية -${user.pharmacy.name}`;
  } else if (user.userType === "Owner") {
    dashboardName = `ادمن النظام -${user.name}`;
  }

  return {
    title: `${dashboardName}`,
  };
}

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
