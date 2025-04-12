import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import ChatFCM from "../../services/FCM";
import {
  getIdClientByOrderID,
  getIdSellerByOrderID,
} from "../../services/OrdersService";
import { getNameClient } from "../../services/ClientService";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./ChatMessages";
import theme from "../../src/theme/theme";
import { getNameSeller } from "../../services/SellerService";

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { idOrder, senderId, senderContext, orderStatus } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef(null);

  const orderPath = `ORD-${idOrder}`;

  const generateChatId = useCallback(() => {
    return `MSG-${Date.now()}-${Math.floor(Math.random() * 999999)}`;
  }, []);

  const handleNewMessage = useCallback(
    (message) => {
      if (!message?.messageText) return;

      setMessages((prevMessages) => {
        const exists = prevMessages.some(
          (m) => m.messageText === message.messageText,
        );
        if (exists) return prevMessages; // Evita agregar duplicados

        return [
          ...prevMessages,
          {
            ...message,
            idChat: message.idChat || generateChatId(),
          },
        ];
      });
    },
    [generateChatId],
  );

  useEffect(() => {
    if (!idOrder || !senderId || !senderContext) {
      console.error("🚨 Falta información clave para iniciar el chat (IDs).");
      return;
    }

    const initializeChat = async () => {
      let idReceiver, receiverName;

      if (senderContext === "SELLER") {
        idReceiver = await getIdClientByOrderID(idOrder);
        receiverName = await getNameClient(idReceiver);
      } else {
        idReceiver = await getIdSellerByOrderID(idOrder);
        receiverName = await getNameSeller(idReceiver);
      }

      navigation.setOptions({
        header: () => (
          <ChatHeader navigation={navigation} clientName={receiverName} />
        ),
      });

      if (idReceiver) {
        setReceiverId(idReceiver);
        console.log("✅ Escuchando mensajes en Firebase...");
        ChatFCM.listenToMessages(orderPath, handleNewMessage);
      }
    };

    initializeChat();

    return () => {
      ChatFCM.stopListening(orderPath);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrder, senderId]);

  useEffect(() => {
    if (isAtBottom && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [isAtBottom, messages]);

  const filteredMessages = useMemo(() => {
    return [...messages]
      .filter(
        (msg) =>
          msg.senderId === `${senderContext}_${senderId}` ||
          msg.receiverId === `${senderContext}_${senderId}`,
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [messages, senderId, senderContext]);

  const handleSendMessage = useCallback(async () => {
    if (!receiverId || newMessage.trim() === "") return;

    const message = {
      idChat: generateChatId(),
      idOrder: `ORD-${idOrder}`,
      senderId: `${senderContext}_${senderId}`,
      receiverId:
        senderContext === "SELLER"
          ? `CLIENT_${receiverId}`
          : `SELLER_${receiverId}`,
      messageText: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await ChatFCM.sendMessage(message);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverId, newMessage, idOrder, senderId]);

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setIsAtBottom(isBottom);
  };

  const renderMessage = useCallback(
    ({ item }) => {
      const timestamp = item.timestamp?.time
        ? new Date(item.timestamp.time)
        : new Date();

      return (
        <MessageBubble
          message={item.messageText}
          timestamp={timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          isSender={item.senderId === `${senderContext}_${senderId}`}
        />
      );
    },
    [senderContext, senderId],
  );

  useEffect(() => {
    const checkOrderStatus = () => {
      if (orderStatus === "FINALIZADA") {
        Alert.alert(
          "Conversación Finalizada",
          "Esta conversación ha sido cerrada porque la orden está finalizada.",
          [
            {
              text: "OK",
              onPress: () => {
                ChatFCM.stopListening(orderPath);
                navigation.goBack();
              },
            },
          ],
        );
      }
    };

    // Verificar inmediatamente al montar el componente
    checkOrderStatus();

    return () => {
      ChatFCM.stopListening(orderPath);
    };
  }, [orderStatus, orderPath, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.idChat}
        extraData={filteredMessages}
        contentContainerStyle={styles.chatContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    padding: 10,
  },
  container: {
    backgroundColor: theme.colors.whiteMedium,
    flex: 1,
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: theme.colors.green,
    borderRadius: 20,
    justifyContent: "center",
    padding: 10,
  },
  textInput: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.whiteMedium,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    padding: 15,
  },
});

export default ChatScreen;
