import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../assets/common";

export const fetchPokemon = createAsyncThunk(
  "pokemon/fetchPokemon",
  async ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => {
    const response = await axios.get(
      `${API_BASE_URL}/pokemon?limit=${pageSize}&offset=${(pageNum - 1) * pageSize}`,
    );

    return response.data;
  },
);

export const fetchPokemonByType = createAsyncThunk(
  "pokemon/fetchPokemonByType",
  async (type: number) => {
    const response = await axios.get(`${API_BASE_URL}/type/${type}`);
    return response.data;
  },
);

export const fetchPokemonDetail = createAsyncThunk(
  "pokemon/fetchPokemonDetail",
  async (pokemonID: number) => {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${pokemonID}`);
    return response.data;
  },
);

export const fetchTypes = createAsyncThunk(
  "types/fetchTypes",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/type`);
    return response.data;
  }
);