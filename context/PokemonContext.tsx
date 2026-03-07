import { PokemonEntry } from "@/types/pokemon";
import React, { createContext, useContext, useEffect, useState } from "react";

type PokemonContextType = {
  caughtPokemon: PokemonEntry[];
  addPokemon: (pokemon: PokemonEntry) => void;
  allNames: string[];
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [caughtPokemon, setCaughtPokemon] = useState<PokemonEntry[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
      .then((res) => res.json())
      .then((data) => setAllNames(data.results.map((r: any) => r.name)));
  }, []);

  const addPokemon = (pokemon: PokemonEntry) => {
    setCaughtPokemon((prev) => [pokemon, ...prev]);
  };

  return (
    <PokemonContext.Provider value={{ caughtPokemon, addPokemon, allNames }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context)
    throw new Error("usePokemon must be used within a PokemonProvider");
  return context;
};
