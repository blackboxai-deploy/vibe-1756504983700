import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">StickerApp</span>
            </div>
            <p className="text-gray-400 text-sm">
              O melhor criador de stickers para WhatsApp. 
              Crie, personalize e envie diretamente para seus contatos.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/editor" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Editor
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Galeria
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Envio Direto WhatsApp</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Templates Brasileiros</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Editor Profissional</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Otimização Automática</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Como Usar</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">FAQ</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Contato</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Privacidade</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 StickerApp. Todos os direitos reservados. 
            Feito com ❤️ para a comunidade brasileira do WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  );
}