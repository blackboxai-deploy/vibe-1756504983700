"use client";

import { WhatsAppStickerCanvas } from "@/components/WhatsAppStickerCanvas";
import { ToolbarPanel } from "@/components/ToolbarPanel";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { WhatsAppPreview } from "@/components/WhatsAppPreview";
import { WhatsAppSender } from "@/components/WhatsAppSender";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStickerContext } from "@/contexts/StickerContext";
import { useWhatsAppContext } from "@/contexts/WhatsAppContext";
import { ArrowLeft, Download, Send, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EditorPage() {
  const { clearCanvas, undo, redo, state } = useStickerContext();
  const { setShowContactSelector, setIsPreviewMode, isPreviewMode } = useWhatsAppContext();
  const [showPreview, setShowPreview] = useState(false);

  const handleExport = async () => {
    // Get canvas element and convert to blob
    const canvas = document.getElementById('sticker-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sticker-${Date.now()}.webp`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/webp', 0.9);
    }
  };

  const handleSendToWhatsApp = () => {
    setShowContactSelector(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Editor de Stickers</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Esconder' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={undo} disabled={state.historyIndex <= 0}>
              Desfazer
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={state.historyIndex >= state.history.length - 1}>
              Refazer
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              Limpar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              size="sm"
              onClick={handleSendToWhatsApp}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Toolbar */}
        <div className="w-16 lg:w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <ToolbarPanel />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative">
              {/* Canvas Container */}
              <div className="relative bg-white rounded-lg shadow-lg p-4">
                <div className="mb-2 text-center">
                  <span className="text-xs text-gray-500">512x512px - WhatsApp Sticker</span>
                </div>
                <WhatsAppStickerCanvas />
                
                {/* Canvas Guidelines */}
                <div className="absolute inset-4 pointer-events-none">
                  <div className="w-full h-full border-2 border-dashed border-gray-200 rounded"></div>
                </div>
              </div>

              {/* Preview Overlay */}
              {showPreview && (
                <div className="absolute top-0 right-0 translate-x-full ml-4">
                  <Card className="p-4 bg-white shadow-lg w-80">
                    <h3 className="font-semibold mb-3 text-center">Preview WhatsApp</h3>
                    <WhatsAppPreview />
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toolbar */}
          <div className="lg:hidden bg-white border-t border-gray-200 p-2">
            <div className="flex items-center justify-center space-x-2 overflow-x-auto">
              <Button variant="outline" size="sm" onClick={undo}>
                Desfazer
              </Button>
              <Button variant="outline" size="sm" onClick={redo}>
                Refazer
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                Limpar
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                size="sm"
                onClick={handleSendToWhatsApp}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="hidden xl:block w-80 bg-white border-l border-gray-200">
          <PropertiesPanel />
        </div>
      </div>

      {/* WhatsApp Sender Modal */}
      <WhatsAppSender />

      {/* Instructions for first-time users */}
      {state.elements.length === 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h4 className="font-semibold text-gray-900 mb-2">Como começar:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use as ferramentas da barra lateral</li>
            <li>• Desenhe, adicione texto ou imagens</li>
            <li>• Clique em "Preview" para ver no WhatsApp</li>
            <li>• "Enviar WhatsApp" para compartilhar</li>
          </ul>
        </div>
      )}
    </div>
  );
}