import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

import { NavBar } from "@/components/NavBar";
import { Main } from "@/components/Main";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "账号管理器v0.0.9",
  description: "一个用于管理魔力宝贝游戏账号的工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body>
        <NavBar />
        <Main>{children}</Main>
      </body>
    </html>
  );
}
