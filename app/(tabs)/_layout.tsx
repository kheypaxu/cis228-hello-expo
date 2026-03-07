import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        // Using a soft pink tint for the active state
        tabBarActiveTintColor: "#FF74B1",
        tabBarInactiveTintColor: "#CDB4B9",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 0, // Android shadow removal
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      {/* Scanner Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <Ionicons name="scan-circle" size={28} color={color} />
          ),
        }}
      />

      {/* Pokedex Gallery Tab */}
      <Tabs.Screen
        name="pokedex"
        options={{
          title: "Pokédex",
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
