import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  HomeSimpleDoor,
  EmojiTalkingHappy,
  ChatBubble,
} from "iconoir-react-native";

import theme from "../src/theme/theme.js";
import string from "../src/string/string.js";
import StyledText from "../src/styles/StyledText.jsx";
import StyledButton from "../src/styles/StyledButton.jsx";
import {
  getLocationPermission,
  getSavedLocation,
} from "../funcions/getCoordinates.js";

export default function WelcomePage() {
  const navigation = useNavigation();
  const [setOrigin] = useState(null);
  const [setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      const savedLocation = await getSavedLocation();

      if (savedLocation) {
        console.log("Usando ubicación guardada:", savedLocation);
        setOrigin(savedLocation);
        setIsLoading(false);
      } else {
        console.log("No hay ubicación guardada, obteniendo nueva...");
        await getLocationPermission(setOrigin, setIsLoading);
      }

      setIsLoading(false);
    };

    fetchLocation();
  }, [setIsLoading, setOrigin]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.image}
      >
        <View style={styles.containerComponent}>
          <Image
            source={require("../assets/XCampo.png")}
            style={{ width: 200, height: 100, borderRadius: 20, marginTop: 10 }}
          ></Image>
          <View style={styles.textContainer}>
            <View style={styles.itemContainer}>
              <HomeSimpleDoor
                height={25}
                width={25}
                color={theme.colors.green}
              />
              <StyledText bold>{string.welcome.hello}</StyledText>
            </View>

            <View style={styles.itemContainer}>
              <EmojiTalkingHappy
                height={25}
                width={25}
                color={theme.colors.green}
              />
              <StyledText bold>{string.welcome.welcomeHappy}</StyledText>
            </View>

            <View style={styles.itemContainer}>
              <ChatBubble height={25} width={25} color={theme.colors.green} />
              <StyledText bold>{string.welcome.chat}</StyledText>
            </View>
          </View>

          <StyledButton
            title={string.App.next}
            onPress={() => navigation.navigate("Hello")}
          ></StyledButton>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  containerComponent: {
    alignItems: "center",
    backgroundColor: theme.colors.opacity,
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
  },
  itemContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  textContainer: {
    backgroundColor: theme.colors.opacity,
    borderRadius: 20,
    flex: 0,
    margin: 40,
    padding: 20,
  },
});
