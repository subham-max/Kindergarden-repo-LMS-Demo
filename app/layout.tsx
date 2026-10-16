import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Learn & Play — Trilingual Learning Portal",
  description: "Alphabet, numbers, poems, culture and exams in Hindi, English and a tribal language.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-32 pt-6">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
