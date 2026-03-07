import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePokemon } from "@/context/PokemonContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PokedexGallery() {
  const { caughtPokemon } = usePokemon();

  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pokémon tap animation
  const animatePokemon = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Filter Pokémon by name
  const filteredPokemon = useMemo(() => {
    return caughtPokemon.filter((pokemon: any) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, caughtPokemon]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>POKÉDEX DATA</ThemedText>

      {/* SEARCH BAR */}
      <TextInput
        placeholder="Search Pokémon..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* POKEMON LIST */}
      <FlatList
        data={filteredPokemon}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <View style={styles.pokeBadge}>
              <ThemedText style={styles.pokeId}>
                #{item.pokedexId.toString().padStart(3, "0")}
              </ThemedText>
            </View>

            <Image
              source={{ uri: item.gifUrl }}
              style={styles.gif}
              contentFit="contain"
            />

            <ThemedText style={styles.name}>{item.name}</ThemedText>
          </TouchableOpacity>
        )}
      />

      {/* MODAL */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setSelected(null)}
              style={styles.closeBtn}
            >
              <Ionicons name="chevron-down" size={30} color="#FF74B1" />
            </TouchableOpacity>

            {/* INTERACTIVE POKEMON */}
            <TouchableOpacity onPress={animatePokemon}>
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <Image
                  source={{ uri: selected?.gifUrl }}
                  style={styles.bigGif}
                  contentFit="contain"
                />
              </Animated.View>
            </TouchableOpacity>

            <ThemedText style={styles.modalTitle}>
              {selected?.name.toUpperCase()}
            </ThemedText>

            <View style={styles.statContainer}>
              <ThemedText style={styles.stat}>
                TYPE: {selected?.type?.toUpperCase()}
              </ThemedText>

              <ThemedText style={styles.stat}>
                SECTOR: {selected?.location}
              </ThemedText>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 32,
    fontFamily: "Poke-Font",
    textAlign: "center",
    marginBottom: 20,
    color: "#FF74B1",
  },

  search: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FFD6E5",
    fontFamily: "Poke-Font",
  },

  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFE3EC",
  },

  pokeBadge: {
    backgroundColor: "#FFF0F5",
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  pokeId: {
    fontSize: 12,
    color: "#FF74B1",
    fontFamily: "Poke-Font",
  },

  gif: {
    width: 100,
    height: 100,
  },

  name: {
    fontSize: 20,
    fontFamily: "Poke-Font",
    marginTop: 10,
    color: "#4A4A4A",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(255,182,193,0.4)",
  },

  modalContent: {
    height: "50%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 40,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 40,
    fontFamily: "Poke-Font",
    color: "#FF74B1",
    marginVertical: 10,
  },

  statContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },

  stat: {
    fontFamily: "Poke-Font",
    fontSize: 20,
    color: "#4A4A4A",
  },

  bigGif: {
    width: 150,
    height: 150,
  },

  closeBtn: {
    marginBottom: 20,
  },
});
