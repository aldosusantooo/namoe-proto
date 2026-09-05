"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { copy } from "@/lib/copy";

type Item = { href: string; label: string; icon: React.ReactNode };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const items: Item[] = [
  {
    href: "/",
    label: copy.nav.home,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6.5 10.5V19h11v-8.5" />
        <path d="M10 19v-4.5h4V19" />
      </svg>
    ),
  },
  {
    href: "/tenant",
    label: copy.nav.tenants,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M4 9.5 5.5 5h13L20 9.5" />
        <path d="M4 9.5c0 1.4 1.1 2.5 2.5 2.5S9 10.9 9 9.5c0 1.4 1.3 2.5 3 2.5s3-1.1 3-2.5c0 1.4 1.1 2.5 2.5 2.5S20 10.9 20 9.5" />
        <path d="M5.5 12v7h13v-7" />
        <path d="M10 19v-4h4v4" />
      </svg>
    ),
  },
  {
    href: "/peta",
    label: copy.nav.map,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M4 7.5 9 5l6 2.5 5-2.5v11.5L15 19l-6-2.5-5 2.5Z" />
        <path d="M9 5v11.5M15 7.5V19" />
      </svg>
    ),
  },
  {
    href: "/jadwal",
    label: copy.nav.schedule,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="4" y="6" width="16" height="14" rx="3" />
        <path d="M4 10.5h16M8 4v4M16 4v4" />
      </svg>
    ),
  },
  {
    href: "/paspor",
    label: copy.nav.passport,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="5" y="3.5" width="14" height="17" rx="3" />
        <circle cx="12" cy="10" r="3" />
        <path d="M8.5 16.5h7" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/jadwal") return pathname.startsWith("/jadwal") || pathname.startsWith("/sesi");
  return pathname.startsWith(href);
}

export function Nav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[var(--safe-bottom)]"
    >
      <ul className="mx-auto flex h-[var(--nav-height)] max-w-[var(--page-max)] items-stretch">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full min-h-[var(--tap-min)] flex-col items-center justify-center gap-0.5 text-caption font-semibold ${
                  active ? "text-primary" : "text-fg-muted"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
