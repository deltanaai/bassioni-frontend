import "./globals.css";
import { Geist, Geist_Mono as GeistMono } from "next/font/google";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import ROUTES from "@/constants/routes";
import { QueryProvider } from "@/context/providers/query-provider";
import logger from "@/lib/logger";
import { getSession } from "@/lib/session";

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
  // const session = await getSession();
  // logger.info(`Session: ${JSON.stringify(session)}`);
  // if (!session?.token) {
  //   redirect(ROUTES.LOGIN);
  // }
  // logger.info(`User Token: ${session.token}`);
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
