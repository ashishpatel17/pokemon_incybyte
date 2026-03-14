
import { Grid, CircularProgress, Alert, Typography, AppBar, Toolbar, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon ,AppDispatch} from "../state/reducer/pokemonSlice";
import type { RootState } from "../state/store";


export default function PokemonList() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error , count} = useSelector((state: RootState) => state.pokemon);
  // list is the raw API response, so results is list.results
  const results = list;

  useEffect(() => {
    dispatch(fetchPokemon({ pageNum: 1, pageSize: 20 }));
  }, [dispatch]);

  return (
    <Container maxWidth="md">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div">
            Pokemon List ({count})
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 24 }}>
        {loading && <><CircularProgress />Loading...</>}
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          {results.map((pokemon: any) => (
            <Grid item xs={6} sm={4} md={3} key={pokemon.name}>
              <div style={{ textAlign: "center" }}>
                {/* Fetch image for each pokemon */}
                <PokemonImage name={pokemon.name} url={pokemon.url} />
                <Typography variant="subtitle1">{pokemon.name}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
}

// Helper component to fetch and show pokemon image

function PokemonImage({ name, url }: { name: string; url: string }) {
  const [img, setImg] = useState("");
  useEffect(() => {
    async function fetchImg() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setImg(data.sprites.front_default);
      } catch {}
    }
    fetchImg();
  }, [url]);
  if (!img) return <CircularProgress  size={24} />;
  return <img src={img} alt={name} style={{ width: 96, height: 96 }} />;
}
