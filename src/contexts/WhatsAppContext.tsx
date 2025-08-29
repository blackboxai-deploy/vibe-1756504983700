"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface SentSticker {
  id: string;
  imageUrl: string;
  sentTo: WhatsAppContact[];
  sentAt: Date;
  name?: string;
}

interface WhatsAppContextType {
  // Contacts
  contacts: WhatsAppContact[];
  selectedContacts: WhatsAppContact[];
  addContact: (contact: WhatsAppContact) => void;
  removeContact: (contactId: string) => void;
  selectContact: (contact: WhatsAppContact) => void;
  deselectContact: (contactId: string) => void;
  clearSelectedContacts: () => void;

  // Stickers
  sentStickers: SentSticker[];
  addSentSticker: (sticker: Omit<SentSticker, "id" | "sentAt">) => void;

  // WhatsApp Integration
  isWhatsAppConnected: boolean;
  setWhatsAppConnected: (connected: boolean) => void;
  sendToWhatsApp: (imageBlob: Blob, contacts: WhatsAppContact[]) => Promise<boolean>;
  openWhatsAppWeb: () => void;

  // UI State
  showContactSelector: boolean;
  setShowContactSelector: (show: boolean) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<WhatsAppContact[]>([]);
  const [sentStickers, setSentStickers] = useState<SentSticker[]>([]);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addContact = (contact: WhatsAppContact) => {
    setContacts(prev => [...prev.filter(c => c.id !== contact.id), contact]);
  };

  const removeContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const selectContact = (contact: WhatsAppContact) => {
    setSelectedContacts(prev => {
      if (prev.find(c => c.id === contact.id)) {
        return prev;
      }
      return [...prev, contact];
    });
  };

  const deselectContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const clearSelectedContacts = () => {
    setSelectedContacts([]);
  };

  const addSentSticker = (stickerData: Omit<SentSticker, "id" | "sentAt">) => {
    const sticker: SentSticker = {
      ...stickerData,
      id: `sticker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentAt: new Date(),
    };
    setSentStickers(prev => [sticker, ...prev]);
  };

  const setWhatsAppConnected = (connected: boolean) => {
    setIsWhatsAppConnected(connected);
  };

  const sendToWhatsApp = async (imageBlob: Blob, contacts: WhatsAppContact[]): Promise<boolean> => {
    try {
      // Convert blob to base64 for sharing
      const base64 = await blobToBase64(imageBlob);
      
      if (contacts.length === 0) {
        // Open WhatsApp Web with the image (general sharing)
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent('Olha esse sticker que criei!')}`;
        window.open(whatsappUrl, '_blank');
        return true;
      }

      // For specific contacts, we'll simulate sending (in real implementation, would use WhatsApp Business API)
      for (const contact of contacts) {
        const whatsappUrl = `https://web.whatsapp.com/send?phone=${contact.phone}&text=${encodeURIComponent('Olha esse sticker que criei!')}`;
        window.open(whatsappUrl, '_blank');
      }

      // Add to sent stickers
      addSentSticker({
        imageUrl: base64,
        sentTo: contacts,
        name: "Meu Sticker",
      });

      return true;
    } catch (error) {
      console.error("Erro ao enviar para WhatsApp:", error);
      return false;
    }
  };

  const openWhatsAppWeb = () => {
    window.open("https://web.whatsapp.com", '_blank');
  };

  // Helper function
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <WhatsAppContext.Provider
      value={{
        contacts,
        selectedContacts,
        addContact,
        removeContact,
        selectContact,
        deselectContact,
        clearSelectedContacts,
        sentStickers,
        addSentSticker,
        isWhatsAppConnected,
        setWhatsAppConnected,
        sendToWhatsApp,
        openWhatsAppWeb,
        showContactSelector,
        setShowContactSelector,
        isPreviewMode,
        setIsPreviewMode,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsAppContext() {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error("useWhatsAppContext must be used within a WhatsAppProvider");
  }
  return context;
}