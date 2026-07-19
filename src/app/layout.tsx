import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Elf Bar Shop — одноразові POD-системи",
  description: "Найяскравіші одноразки Elf Bar. Обирай смак, дивись наявність, замовляй в Telegram.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-app min-h-screen font-body antialiased">
        <LangProvider>
          <CartProvider>
            <Header />
            <main className="max-w-6xl mx-auto px-4 pb-24">{children}</main>
            <CartDrawer />
            <footer className="border-t border-white/10 mt-16 py-8 text-center text-sm text-white/40">
              © {new Date().getFullYear()} Elf Bar Shop
            </footer>
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
