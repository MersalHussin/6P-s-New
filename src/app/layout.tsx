import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: "Passion Path",
  description: "اكتشف شغفك وانطلق في رحلة الـ 6Ps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="ar" dir="rtl">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700;900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-body antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </LanguageProvider>
  );
}
