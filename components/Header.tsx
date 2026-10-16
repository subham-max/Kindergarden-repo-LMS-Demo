"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";
import LangSwitch from "./LangSwitch";
import { pop } from "@/lib/audio";

export default function Header() {
  const { t } = useLang();
  const path = usePathname() ?? "/";

  // Lesson pages (/learn/{module}/{item}) are full-screen with their own top bar.
  // The Traditional Dress studio (/learn/dress) is full-screen too.
  if (/^\/learn\/[^/]+\/[^/]+/.test(path) || path === "/learn/dress") return null;

  return (
    <header className="sticky top-0 z-40 border-b-4 border-sun-400 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          {path !== "/" && (
            <Link
              href="/"
              onClick={() => pop(520)}
              aria-label={t("back")}
              className="grid h-12 w-12 place-items-center rounded-full bg-leaf-400 text-2xl text-white shadow-md transition hover:scale-110 active:scale-95"
            >
              ←
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold text-sky-600">
            <span className="animate-floaty text-3xl">🦜</span>
            {t("title")}
          </Link>
        </div>
        <LangSwitch />
      </div>
    </header>
  );
}
