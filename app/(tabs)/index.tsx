import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/context/PokemonContext";

export default function ScannerScreen() {
  const router = useRouter();
  const { addPokemon, allNames } = usePokemon();

  const [trainerName, setTrainerName] = useState("");
  const [pokeSearch, setPokeSearch] = useState("");
  const [location, setLocation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [latest, setLatest] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [entryLog, setEntryLog] = useState<any[]>([]);

  const handleSearchChange = (text: string) => {
    setPokeSearch(text);

    if (text.length > 0) {
      const filtered = allNames
        .filter((name) => name.toLowerCase().startsWith(text.toLowerCase()))
        .slice(0, 5);

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const logDiscovery = async () => {
    if (!trainerName) {
      Alert.alert("Trainer Required", "Please enter your Trainer Name first.");
      return;
    }

    if (!pokeSearch || !location) {
      Alert.alert("Trainer!", "We need a Pokémon name and location.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokeSearch.toLowerCase().trim()}`,
      );

      if (!response.ok) throw new Error("Pokemon not found");

      const data = await response.json();

      const animatedGif = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${data.id}.gif`;

      const newEntry = {
        id: Date.now().toString(),
        pokedexId: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        location: location,
        gifUrl: animatedGif,
        type: data.types[0].type.name,
        height: data.height,
        weight: data.weight,
      };

      addPokemon(newEntry);

      setLatest(newEntry);
      setEntryLog((prev) => [newEntry, ...prev]);

      setPokeSearch("");
      setLocation("");
      setSuggestions([]);
    } catch (error) {
      Alert.alert("Scan Failed", "No Pokémon found.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.topBar}>
          <View>
            <ThemedText style={styles.statusTag}>TRAINER TERMINAL</ThemedText>

            <ThemedText type="title" style={styles.titleText}>
              {trainerName ? `Hello, ${trainerName}` : "POKE-SCANNER"}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/pokedex")}
          >
            <Ionicons name="apps" size={24} color="#FF74B1" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* TRAINER CARD */}

          <ThemedView style={styles.card}>
            <ThemedText style={styles.panelLabel}>TRAINER PROFILE</ThemedText>

            <View style={styles.inputBox}>
              <Ionicons name="person" size={18} color="#FF74B1" />

              <TextInput
                style={styles.input}
                placeholder="Enter Trainer Name"
                placeholderTextColor="#CDB4B9"
                value={trainerName}
                onChangeText={setTrainerName}
              />
            </View>
          </ThemedView>

          {/* SCANNER */}

          <View style={styles.viewfinder}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FF74B1" />
            ) : latest ? (
              <Image
                source={{ uri: latest.gifUrl }}
                style={styles.mainGif}
                contentFit="contain"
              />
            ) : (
              <View style={styles.emptyViewfinder}>
                <Ionicons name="scan-outline" size={60} color="#FFD1E3" />

                <ThemedText style={styles.emptyText}>
                  WAITING FOR TARGET
                </ThemedText>
              </View>
            )}
          </View>

          {/* INPUT PANEL */}

          <ThemedView style={styles.card}>
            <ThemedText style={styles.panelLabel}>DATA INPUT</ThemedText>

            <View style={styles.inputBox}>
              <Ionicons name="flashlight" size={18} color="#FF74B1" />

              <TextInput
                style={styles.input}
                placeholder="Pokemon Name"
                placeholderTextColor="#CDB4B9"
                value={pokeSearch}
                onChangeText={handleSearchChange}
              />
            </View>

            {suggestions.length > 0 && (
              <View style={styles.dropdown}>
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => {
                      setPokeSearch(s);
                      setSuggestions([]);
                    }}
                  >
                    <ThemedText style={styles.dropdownItem}>
                      {s.toUpperCase()}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.inputBox}>
              <Ionicons name="map" size={18} color="#A2D2FF" />

              <TextInput
                style={styles.input}
                placeholder="Capture Location"
                placeholderTextColor="#CDB4B9"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <TouchableOpacity
              style={styles.scanBtn}
              onPress={logDiscovery}
              disabled={isLoading}
            >
              <ThemedText style={styles.scanBtnText}>
                {isLoading ? "SCANNING..." : "RECORD ENTRY"}
              </ThemedText>

              <Ionicons name="pulse" size={20} color="white" />
            </TouchableOpacity>
          </ThemedView>

          {/* ENTRY LOG */}

          <ThemedView style={styles.card}>
            <ThemedText style={styles.panelLabel}>DISCOVERY LOG</ThemedText>

            {entryLog.length === 0 ? (
              <ThemedText style={styles.emptyLog}>
                No discoveries yet
              </ThemedText>
            ) : (
              entryLog.map((poke) => (
                <View key={poke.id} style={styles.logItem}>
                  <Image
                    source={{ uri: poke.gifUrl }}
                    style={styles.logGif}
                    contentFit="contain"
                  />

                  <View>
                    <ThemedText style={styles.logName}>
                      {poke.name.toUpperCase()}
                    </ThemedText>

                    <ThemedText style={styles.logLocation}>
                      📍 {poke.location}
                    </ThemedText>
                  </View>
                </View>
              ))
            )}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
    paddingTop: 60,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 15,
  },

  statusTag: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#FF74B1",
    fontWeight: "900",
    fontFamily: "Poke-Font",
  },

  titleText: {
    fontSize: 30,
    color: "#4A4A4A",
    fontWeight: "800",
    fontFamily: "Poke-Font",
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFE3EC",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE3EC",
  },

  panelLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFB6C1",
    marginBottom: 10,
    letterSpacing: 1.5,
    fontFamily: "Poke-Font",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9FB",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "#FFE3EC",
    marginBottom: 15,
  },

  input: {
    flex: 1,
    color: "#4A4A4A",
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "Poke-Font",
  },

  dropdown: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#FFE3EC",
  },

  dropdownItem: {
    paddingVertical: 8,
    color: "#FF74B1",
    fontWeight: "bold",
    fontFamily: "Poke-Font",
  },

  viewfinder: {
    height: 220,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#FFD1E3",
  },

  mainGif: {
    width: 150,
    height: 150,
  },

  emptyViewfinder: {
    alignItems: "center",
    gap: 10,
  },

  emptyText: {
    fontSize: 14,
    color: "#FFB6C1",
    fontWeight: "700",
    letterSpacing: 1,
    fontFamily: "Poke-Font",
  },

  scanBtn: {
    flexDirection: "row",
    backgroundColor: "#FF74B1",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  scanBtnText: {
    color: "white",
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: "Poke-Font",
    fontSize: 16,
  },

  logItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },

  logGif: {
    width: 60,
    height: 60,
  },

  logName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF74B1",
    fontFamily: "Poke-Font",
  },

  logLocation: {
    fontSize: 14,
    color: "#777",
    fontFamily: "Poke-Font",
  },

  emptyLog: {
    textAlign: "center",
    color: "#CDB4B9",
    fontFamily: "Poke-Font",
  },
});
