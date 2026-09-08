"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/lib/copy";
import { TAB_ICONS, type TabIconKey } from "./icons/TabIcons";

type Item = { href: string; label: string; icon: TabIconKey };

const items: Item[] = [
  { href: "/", label: copy.nav.home, icon: "beranda" },
  { href: "/tenant", label: copy.nav.tenants, icon: "tenant" },
  { href: "/peta", label: copy.nav.map, icon: "peta" },
  { href: "/jadwal", label: copy.nav.schedule, icon: "jadwal" },
  { href: "/paspor", label: copy.nav.passport, icon: "paspor" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/feed");
  if (href === "/jadwal") return pathname.startsWith("/jadwal") || pathname.startsWith("/sesi") || pathname.startsWith("/pembicara");
  return pathname.startsWith(href);
}

/** Bottom tab bar: five equal columns, active tab is a filled icon on a yellow pill. */
export function Nav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-edge bg-paper pb-[var(--safe-bottom)]">
      <ul className="mx-auto grid h-[var(--nav-height)] max-w-[var(--page-max)] grid-cols-5 items-center px-1.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = active ? TAB_ICONS[item.icon].active : TAB_ICONS[item.icon].outline;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 font-display text-caption font-semibold ${
                  active ? "text-navy" : "text-ink-soft"
                }`}
              >
                <span className={`flex h-8 w-13 items-center justify-center rounded-pill ${active ? "bg-tab-active text-ink" : ""}`}>
                  <Icon size={28} />
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
