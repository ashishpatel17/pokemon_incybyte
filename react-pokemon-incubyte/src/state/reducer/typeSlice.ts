import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTypes = createAsyncThunk(
  "types/fetchTypes",
  async () => {
    const response = await axios.get("https://pokeapi.co/api/v2/type");
    return response.data;
  }
);

const typeSlice = createSlice({
  name: "types",
  initialState: {
    types: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload.results;
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default typeSlice.reducer;