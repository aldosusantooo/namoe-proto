import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { APP_NAME } from "@/lib/copy";
import tokens from "@/lib/tokens.generated.json";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s, ${APP_NAME}` },
  description: "Panduan pengunjung Namoe Market, 22 sampai 25 Oktober 2026 di PIK Avenue Mall.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: tokens.base.cream,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
