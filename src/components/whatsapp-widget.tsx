"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
  position?: "bottom-right" | "bottom-left";
  locale?: "fr" | "ar";
}

export function WhatsAppWidget({
  phoneNumber = "22233344",
  message = "Bonjour, je suis intéressé par vos services.",
  position = "bottom-right",
  locale = "fr",
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState(message);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(inputMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const isRTL = locale === "ar";

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end gap-2`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl shadow-2xl p-4 w-80 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {locale === "fr" ? "Discutons sur WhatsApp" : "دعنا نتحدث عبر واتساب"}
                </h3>
                <p className="text-sm text-gray-500">
                  {locale === "fr" ? "Réponse rapide garantie" : "رد سريع مضمون"}
                </p>
              </div>
            </div>

            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                locale === "fr"
                  ? "Écrivez votre message..."
                  : "اكتب رسالتك..."
              }
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              rows={3}
            />

            <button
              onClick={openWhatsApp}
              className="mt-3 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              {locale === "fr" ? "Envoyer sur WhatsApp" : "إرسال عبر واتساب"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-lg shadow-lg px-3 py-1.5"
          >
            <span className="text-xs font-medium text-gray-700">
              {locale === "fr" ? "Besoin d'aide?" : "تحتاج مساعدة؟"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}