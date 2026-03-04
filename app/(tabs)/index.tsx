import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Button, Platform, StyleSheet, TextInput } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  // adding state to get user's name
  const [name, setName] = useState("");

  // function to handle the button press
  const handlePress = () => {
    if (name.trim() === "") {
      Alert.alert("Hello!", "Please enter your name first!");
    } else {
      Alert.alert("Greetings!", `Hello, ${name}! Welcome to my EXPO APP.`);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D1E8E2", dark: "#19747E" }}
      headerImage={
        <Image
          source={require("@/assets/images/eunwoo.png")}
          style={styles.headerImage}
        />
      }
    >
      {/* personalized greeting */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hi there, {name || "Hooman"}!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Let's get started:</ThemedText>

        {/* asking for user's name */}
        <ThemedText>What is your name?</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Type your name here..."
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        {/* button that uses the handlePress function */}
        <ThemedView style={styles.buttonWrapper}>
          <Button
            title="Say Hello"
            onPress={handlePress}
            color={Platform.OS === "ios" ? "#11181C" : "#19747E"}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// custom css styles
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 20,
  },
  stepContainer: {
    gap: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerImage: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
});
