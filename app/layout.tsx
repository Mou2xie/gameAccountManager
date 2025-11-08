import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

import { NavBar } from "@/components/NavBar";
import { Main } from "@/components/Main";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "账号管理器v0.0.9",
  description: "一个用于管理魔力宝贝游戏账号的工具",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={notoSans.variable}>
      <body className=" min-h-screen">
        <ServiceWorkerRegister />
        <NavBar />
        <Main>{children}</Main>
      </body>
    </html>
  );
}
