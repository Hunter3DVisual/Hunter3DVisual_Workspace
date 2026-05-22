import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hunter3Dvisual Workspace",
    template: "%s | Hunter3Dvisual",
  },
  description: "AI-powered operating system for Archviz studio — projects, pipeline, finance & more.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#0c0e14",
          colorPrimary: "#E8521A",
          colorText: "#e2e8f0",
          colorInputBackground: "#111420",
          colorInputText: "#e2e8f0",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`} suppressHydrationWarning>
        <body className="min-h-screen bg-hunter-bg text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
