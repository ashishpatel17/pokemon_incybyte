import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${(pageNum - 1) * pageSize}`,
    );

    return response.data;
  },
);

export const fetchPokemonByType = createAsyncThunk(
  "pokemon/fetchPokemonByType",
  async (type: number) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    return response.data;
  },
);

export const fetchPokemonDetail = createAsyncThunk(
  "pokemon/fetchPokemonDetail",
  async (pokemonID: number) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    return response.data;
  },
);

export const fetchTypes = createAsyncThunk(
  "types/fetchTypes",
  async () => {
    const response = await axios.get("https://pokeapi.co/api/v2/type");
    return response.data;
  }
);