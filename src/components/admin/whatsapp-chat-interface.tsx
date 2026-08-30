"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, Paperclip, Send, Smile, Phone, Video, Check, CheckCheck, Clock, MessageSquare } from "lucide-react";

interface WhatsAppChatInterfaceProps {
  locale: "fr" | "ar";
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status: "sent" | "delivered" | "read" | "pending";
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  avatar: string;
  online: boolean;
}

export function WhatsAppChatInterface({ locale }: WhatsAppChatInterfaceProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Ahmed Ould",
      lastMessage: "Bonjour, je voudrais commander un routeur",
      lastTime: "10:30",
      unread: 2,
      avatar: "AO",
      online: true,
    },
    {
      id: "2",
      name: "Fatima Mint",
      lastMessage: "La livraison est arrivee",
      lastTime: "09:15",
      unread: 0,
      avatar: "FM",
      online: false,
    },
    {
      id: "3",
      name: "Mohamed Salem",
      lastMessage: "Merci pour votre service",
      lastTime: "Hier",
      unread: 0,
      avatar: "MS",
      online: true,
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      { id: "1", text: "Bonjour, je voudrais commander un routeur", timestamp: new Date(), isOwn: false, status: "read" },
      { id: "2", text: "Oui, quel modele?", timestamp: new Date(), isOwn: true, status: "read" },
      { id: "3", text: "Le TP-Link Archer AX50", timestamp: new Date(), isOwn: false, status: "read" },
    ],
    "2": [
      { id: "1", text: "La livraison est arrivee", timestamp: new Date(), isOwn: false, status: "read" },
    ],
    "3": [
      { id: "1", text: "Merci pour votre service", timestamp: new Date(), isOwn: false, status: "read" },
    ],
  });

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date(),
      isOwn: true,
      status: "sent",
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    setMessage("");

    // Simulate delivery and read status
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].map(m =>
          m.id === newMessage.id ? { ...m, status: "delivered" as const } : m
        ),
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].map(m =>
          m.id === newMessage.id ? { ...m, status: "read" as const } : m
        ),
      }));
    }, 2000);
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-600" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-600" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl overflow-hidden border border-yellow-500/30">
      <div className="flex h-full">
        {/* Contacts Sidebar */}
        <div className="w-80 bg-gray-100 border-r border-yellow-500/30 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-yellow-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <div className="text-white font-semibold">MauriTech</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {locale === "fr" ? "En ligne" : "متصل"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder={locale === "fr" ? "Rechercher..." : "بحث..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-100 transition ${
                  selectedContact?.id === contact.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-medium">
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">{contact.name}</span>
                    <span className="text-xs text-gray-600">{contact.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{contact.lastMessage}</span>
                    {contact.unread > 0 && (
                      <span className="px-2 py-0.5 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-yellow-500/30 flex items-center justify-between bg-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-medium">
                      {selectedContact.avatar}
                    </div>
                    {selectedContact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">{selectedContact.name}</div>
                    <div className="text-xs text-green-400">
                      {selectedContact.online
                        ? (locale === "fr" ? "En ligne" : "متصل")
                        : (locale === "fr" ? "Hors ligne" : "غير متصل")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages[selectedContact.id]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isOwn
                          ? "bg-yellow-500 text-gray-900"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${
                        msg.isOwn ? "text-gray-700" : "text-gray-600"
                      }`}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {msg.isOwn && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-yellow-500/30 bg-gray-100">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder={locale === "fr" ? "Tapez un message..." : "اكتب رسالة..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-gray-900 transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {locale === "fr" ? "WhatsApp Web" : "واتساب ويب"}
                </h3>
                <p className="text-gray-600">
                  {locale === "fr" 
                    ? "Selectionnez une conversation pour commencer" 
                    : "حدد محادثة للبدء"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}