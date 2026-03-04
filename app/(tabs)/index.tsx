import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  // adding state to get user's name
  const [name, setName] = useState("");
  // adding state for the new task input
  const [task, setTask] = useState("");
  // adding state to store the list of tasks
  const [tasks, setTasks] = useState<string[]>([]);

  // function to handle adding a task
  const addTask = () => {
    if (task.trim() === "") {
      Alert.alert("Empty Task", "Please enter a task before adding.");
    } else {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  // unique function to shuffle task priority
  const shuffleTasks = () => {
    if (tasks.length < 2) {
      Alert.alert("Notice", "Add more tasks to shuffle your priority.");
      return;
    }
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    setTasks(shuffled);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FDEFF4", dark: "#3D1E25" }}
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
        {/* asking for user's name */}
        <ThemedText>Profile Name</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Update name..."
          placeholderTextColor="#CDB4B9"
          value={name}
          onChangeText={setName}
        />

        {/* input for new tasks */}
        <ThemedText type="subtitle">Daily Tasks</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#CDB4B9"
          value={task}
          onChangeText={setTask}
        />

        {/* button to add task to list */}
        <ThemedView style={styles.buttonWrapper}>
          <Button
            title="Add Task"
            onPress={addTask}
            color={Platform.OS === "ios" ? "#E8A0B5" : "#D47793"}
          />
        </ThemedView>

        {/* unique shuffle function button */}
        <TouchableOpacity style={styles.shuffleButton} onPress={shuffleTasks}>
          <Ionicons name="shuffle" size={20} color="white" />
          <ThemedText style={styles.shuffleText}>Shuffle Priority</ThemedText>
        </TouchableOpacity>

        {/* scrollable list of tasks */}
        <ScrollView style={styles.listContainer} scrollEnabled={false}>
          {tasks.map((item, index) => (
            <ThemedView key={index} style={styles.todoItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#E8A0B5"
              />
              <ThemedText style={styles.todoText}>{item}</ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
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
    borderColor: "#FADADD",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "rgba(250, 218, 221, 0.2)",
    color: "#D47793",
  },
  buttonWrapper: {
    marginTop: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  shuffleButton: {
    flexDirection: "row",
    backgroundColor: "#D47793",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  shuffleText: {
    color: "white",
    fontWeight: "600",
  },
  listContainer: {
    marginTop: 5,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(250, 218, 221, 0.1)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(232, 160, 181, 0.3)",
    gap: 10,
  },
  todoText: {
    fontSize: 16,
    color: "white",
  },
});
