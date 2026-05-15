import type { Metadata } from "next";
import "./globals.css";
import { WatchTimeProvider } from "@/context/WatchTimeContext";
import { ThemeProvider } from "@/context/ThemeContext";
export const metadata: Metadata = { title: "RayaTube Islami", description: "Video edukasi Islami untuk anak-anak Indonesia" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('kt_theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')})()` }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider><WatchTimeProvider>{children}</WatchTimeProvider></ThemeProvider>
      </body>
    </html>
  );
}
