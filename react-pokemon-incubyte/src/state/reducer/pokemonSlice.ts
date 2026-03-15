import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { count } from "console";
import { store } from "../store";

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

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    list: [],
    loading: false,
    count: 0,
    error: null as string | null,
    detail: null as any,
  },
  reducers: {
    setPokemon: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results.map((item: any) => ({
          name: item.name,
          url: item.url,
        }));
        state.count = action.payload.count;
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(fetchPokemonByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonByType.fulfilled, (state, action) => {
        state.loading = false;
        state.list =
          action.payload?.pokemon?.map((item: any) => item.pokemon) ?? [];
        state.count = action.payload?.pokemon?.length ?? 0;
      })
      .addCase(fetchPokemonByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(fetchPokemonDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchPokemonDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setPokemon } = pokemonSlice.actions;

export default pokemonSlice.reducer;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
