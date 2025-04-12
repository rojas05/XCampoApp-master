import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../src/theme/theme";

const MessageBubble = ({ message, timestamp, isSender }) => {
  return (
    <View
      style={[
        styles.bubble,
        isSender ? styles.senderBubble : styles.receiverBubble,
      ]}
    >
      <Text style={styles.messageText}>{message}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: "75%",
    minWidth: 50,
    padding: 12,
  },
  messageText: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: "500",
  },
  receiverBubble: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.whiteMedium,
    borderStartEndRadius: 5,
    borderWidth: 1,
    elevation: 1,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  senderBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.greenLiht,
    borderEndEndRadius: 5,
  },
  timestamp: {
    alignSelf: "flex-end",
    color: theme.colors.greyBlack,
    fontSize: 11,
    marginTop: 3,
    opacity: 0.7,
  },
});

export default MessageBubble;
