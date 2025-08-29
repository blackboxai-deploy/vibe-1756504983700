"use client";

import { useWhatsAppContext } from "@/contexts/WhatsAppContext";
import { useStickerContext } from "@/contexts/StickerContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

export function WhatsAppSender() {
  const { 
    showContactSelector, 
    setShowContactSelector, 
    selectedContacts, 
    selectContact, 
    deselectContact, 
    clearSelectedContacts,
    sendToWhatsApp,
    contacts,
    addContact 
  } = useWhatsAppContext();
  
  const { state } = useStickerContext();
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleAddContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      const contact = {
        id: `contact_${Date.now()}`,
        name: newContactName.trim(),
        phone: newContactPhone.trim().replace(/\D/g, ''), // Remove non-digits
        avatar: undefined
      };
      
      addContact(contact);
      setNewContactName("");
      setNewContactPhone("");
      toast.success(`Contato ${contact.name} adicionado!`);
    }
  };

  const handleSendSticker = async () => {
    const canvas = document.getElementById('sticker-canvas') as HTMLCanvasElement;
    if (!canvas) {
      toast.error("Canvas não encontrado!");
      return;
    }

    setIsSending(true);

    try {
      // Convert canvas to WebP blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Falha ao converter canvas"));
          }
        }, 'image/webp', 0.9);
      });

      // Check file size (WhatsApp limit is ~100KB for stickers)
      if (blob.size > 100 * 1024) {
        toast.warning("Sticker muito grande! WhatsApp recomenda menos de 100KB. Será comprimido automaticamente.");
      }

      const success = await sendToWhatsApp(blob, selectedContacts);
      
      if (success) {
        toast.success(
          selectedContacts.length > 0 
            ? `Sticker enviado para ${selectedContacts.length} contato(s)!`
            : "WhatsApp Web aberto! Cole seu sticker no chat desejado."
        );
        setShowContactSelector(false);
        clearSelectedContacts();
      } else {
        toast.error("Falha ao enviar sticker");
      }
    } catch (error) {
      console.error("Erro ao enviar sticker:", error);
      toast.error("Erro ao processar sticker");
    } finally {
      setIsSending(false);
    }
  };

  const sampleContacts = [
    { id: "sample1", name: "Maria Silva", phone: "11987654321" },
    { id: "sample2", name: "João Santos", phone: "11876543210" },
    { id: "sample3", name: "Ana Costa", phone: "11765432109" },
    { id: "sample4", name: "Pedro Oliveira", phone: "11654321098" }
  ];

  const allContacts = [...contacts, ...sampleContacts];

  return (
    <Dialog open={showContactSelector} onOpenChange={setShowContactSelector}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-green-600">📱</span>
            <span>Enviar para WhatsApp</span>
          </DialogTitle>
          <DialogDescription>
            Selecione contatos ou envie diretamente para o WhatsApp Web
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Contacts */}
          {selectedContacts.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Contatos Selecionados ({selectedContacts.length})
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedContacts.map((contact) => (
                  <Badge 
                    key={contact.id} 
                    variant="secondary" 
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => deselectContact(contact.id)}
                  >
                    <span>{contact.name}</span>
                    <span className="text-xs opacity-70">×</span>
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelectedContacts}
                className="text-xs"
              >
                Limpar Seleção
              </Button>
            </div>
          )}

          {/* Quick Send Option */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Envio Rápido</h4>
                  <p className="text-sm text-green-600">
                    Abrir WhatsApp Web diretamente
                  </p>
                </div>
                <Button 
                  onClick={handleSendSticker}
                  disabled={isSending || state.elements.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSending ? "Enviando..." : "Abrir WhatsApp"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Add New Contact */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Adicionar Novo Contato</Label>
            <div className="space-y-2">
              <Input
                placeholder="Nome do contato"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
              <div className="flex space-x-2">
                <Input
                  placeholder="Número (11999999999)"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddContact}
                  disabled={!newContactName.trim() || !newContactPhone.trim()}
                  variant="outline"
                >
                  ➕
                </Button>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          {allContacts.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Selecionar Contatos {contacts.length > 0 && "(Seus Contatos + Exemplos)"}
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allContacts.map((contact) => {
                  const isSelected = selectedContacts.some(c => c.id === contact.id);
                  const isExample = sampleContacts.some(c => c.id === contact.id);
                  
                  return (
                    <div
                      key={contact.id}
                      onClick={() => isSelected ? deselectContact(contact.id) : selectContact(contact)}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? "bg-green-100 border border-green-300" : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isSelected ? "bg-green-600 text-white" : "bg-gray-300"}>
                          {contact.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact.name}
                          {isExample && <span className="text-xs text-gray-500 ml-1">(exemplo)</span>}
                        </p>
                        <p className="text-xs text-gray-500">+55 {contact.phone}</p>
                      </div>
                      {isSelected && (
                        <div className="text-green-600">✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Send Button */}
          {selectedContacts.length > 0 && (
            <div className="pt-4 border-t">
              <Button 
                onClick={handleSendSticker}
                disabled={isSending || state.elements.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSending 
                  ? "Enviando..." 
                  : `Enviar Sticker (${selectedContacts.length} contato${selectedContacts.length !== 1 ? 's' : ''})`
                }
              </Button>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              💡 Dica: O sticker será otimizado automaticamente para WhatsApp (WebP, 512x512px)
            </p>
            {state.elements.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Adicione elementos ao seu sticker antes de enviar
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}