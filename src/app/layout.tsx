import type { Metadata } from "next";
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
  title: "台灣醫美地圖 - 找到最適合你的醫美診所",
  description:
    "在地圖上瀏覽台北市、新北市的醫美診所，依療程類型與價格篩選，找到最適合你的醫美診所。",
  openGraph: {
    title: "台灣醫美地圖",
    description: "在地圖上瀏覽台北市、新北市的醫美診所",
    locale: "zh_TW",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
