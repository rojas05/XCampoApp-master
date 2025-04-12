import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onChildAdded,
  onValue,
  off,
  remove,
} from "firebase/database";

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";
import { sendMessageDB } from "./ChatFCMService";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

class ChatFCM {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
    this.listeners = {};
  }

  /**
   * Escucha mensajes en tiempo real de Firebase
   * @param {string} idOrder - ID de la orden
   * @param {Function} onMessageReceived - Callback que recibe los mensajes
   */
  listenToMessages(idOrder, onMessageReceived) {
    // Detener cualquier listener existente antes de agregar uno nuevo
    this.stopListening(idOrder);

    const chatRef = ref(this.db, `chats/${idOrder}`);

    // Obtener mensajes previos
    const historyListener = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const messages = Object.values(snapshot.val());
        messages.forEach((message) => onMessageReceived(message));
      } else {
        console.log("🛑 No hay mensajes en la conversación.");
      }
    });

    // Escuchar solo nuevos mensajes en tiempo real
    const newMessagesListener = onChildAdded(chatRef, (snapshot) => {
      const message = snapshot.val();
      if (message) {
        onMessageReceived(message);
      }
    });

    // Guardamos los listeners para eliminarlos cuando sea necesario
    this.listeners[idOrder] = { chatRef, historyListener, newMessagesListener };
  }

  /**
   * Detiene la escucha de mensajes para una orden específica
   * @param {string} idOrder - ID de la orden
   */
  stopListening(idOrder) {
    if (this.listeners[idOrder]) {
      const { chatRef, historyListener, newMessagesListener } =
        this.listeners[idOrder];

      off(chatRef, "value", historyListener);
      off(chatRef, "child_added", newMessagesListener);

      delete this.listeners[idOrder];

      console.log(`🛑 Detenido el escucha de mensajes en chats/${idOrder}`);
    }
  }

  /**
   * Envía un mensaje usando el servicio REST
   * @param {Object} message - Objeto con el mensaje
   */
  async sendMessage(message) {
    try {
      const success = await sendMessageDB(message);

      if (success) {
        console.log("✅ Mensaje enviado correctamente a Firebase.");
      } else {
        console.error("❌ Error: el servicio REST no confirmó el envío.");
      }
    } catch (error) {
      console.error("🔥 Error enviando mensaje a Firebase:", error);
    }
  }

  /**
   * Elimina una conversación completa
   * @param {string} idOrder - ID de la orden
   */
  async deleteConversation(idOrder) {
    try {
      const chatRef = ref(this.db, `chats/${idOrder}`);
      await remove(chatRef);
      console.log(`✅ Conversación ${idOrder} eliminada correctamente`);
      return true;
    } catch (error) {
      console.error("🔥 Error eliminando conversación:", error);
      return false;
    }
  }
}

export default new ChatFCM();
