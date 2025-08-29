import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { StickerProvider } from "@/contexts/StickerContext";
import { WhatsAppProvider } from "@/contexts/WhatsAppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StickerApp - Criador de Stickers para WhatsApp",
  description: "Crie stickers personalizados para WhatsApp e envie diretamente para seus contatos. Interface intuitiva, templates brasileiros e otimização automática.",
  keywords: "stickers, whatsapp, criador, editor, memes, reações",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <WhatsAppProvider>
          <StickerProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </StickerProvider>
        </WhatsAppProvider>
      </body>
    </html>
  );
}