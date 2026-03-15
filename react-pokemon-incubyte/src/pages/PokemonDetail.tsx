import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  InputAdornment,
  TextField,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetail } from "../state/reducer/pokemonSlice";
import type { RootState, AppDispatch } from "../state/store";
import { AnyListenerPredicate } from "@reduxjs/toolkit";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  fire: { bg: "#FAECE7", text: "#993C1D" },
  water: { bg: "#E6F1FB", text: "#185FA5" },
  grass: { bg: "#EAF3DE", text: "#3B6D11" },
  electric: { bg: "#FAEEDA", text: "#854F0B" },
  psychic: { bg: "#FBEAF0", text: "#993556" },
  ice: { bg: "#E6F1FB", text: "#0C447C" },
  dragon: { bg: "#EEEDFE", text: "#534AB7" },
  dark: { bg: "#F1EFE8", text: "#2C2C2A" },
  fighting: { bg: "#FAECE7", text: "#712B13" },
  poison: { bg: "#FBEAF0", text: "#72243E" },
  ground: { bg: "#FAEEDA", text: "#633806" },
  flying: { bg: "#E6F1FB", text: "#185FA5" },
  bug: { bg: "#EAF3DE", text: "#27500A" },
  rock: { bg: "#F1EFE8", text: "#444441" },
  ghost: { bg: "#EEEDFE", text: "#3C3489" },
  steel: { bg: "#F1EFE8", text: "#5F5E5A" },
  normal: { bg: "#F1EFE8", text: "#5F5E5A" },
  fairy: { bg: "#FBEAF0", text: "#D4537E" },
};

const STAT_COLORS: Record<string, string> = {
  hp: "#E24B4A",
  attack: "#EF9F27",
  defense: "#378ADD",
  "special-attack": "#7F77DD",
  "special-defense": "#1D9E75",
  speed: "#D4537E",
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

export default function PokemonDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const pokemon = useSelector((state: RootState) => state.pokemon.detail);
  const loading = useSelector((state: RootState) => state.pokemon.loading);
  const [moveSearch, setMoveSearch] = useState("");

  useEffect(() => {
    if (pokemonId) {
      const id = parseInt(pokemonId, 10);
      dispatch(fetchPokemonDetail(id));
    }
  }, [dispatch, pokemonId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pokemon) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No Pokémon selected</Typography>
      </Box>
    );
  }

  const moves: any = [
    ...new Set(pokemon.moves.map((m: any) => m.move.name as string)),
  ];

  const filteredMoves = moves.filter((m: any) =>
    m.toLowerCase().includes(moveSearch.toLowerCase()),
  );

  const spriteDefault = pokemon.sprites?.front_default;
  const spriteShiny = pokemon.sprites?.front_shiny;
  const spriteBack = pokemon.sprites?.back_default;
  const artworkUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default;

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 3,
        mb: 4,
        borderRadius: 3,
        border: "0.5px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          src={artworkUrl || spriteDefault}
          alt={pokemon.name}
          sx={{ width: 80, height: 80, bgcolor: "grey.100" }}
          variant="rounded"
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                fontWeight={500}
                textTransform="capitalize"
              >
                {pokemon.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                #{pokemon.id}
              </Typography>
            </Box>
            <IconButton onClick={() => navigate('/')}>
              <ArrowBack />
            </IconButton>
          </Box>

          {/* Types */}
          <Box sx={{ display: "flex", gap: 0.75, mb: 1 }}>
            {pokemon.types.map((t: any) => {
              const typeName = t.type.name;
              const colors = TYPE_COLORS[typeName] || {
                bg: "#F1EFE8",
                text: "#444441",
              };
              return (
                <Chip
                  key={typeName}
                  label={typeName}
                  size="small"
                  sx={{
                    bgcolor: colors.bg,
                    color: colors.text,
                    fontWeight: 500,
                    fontSize: 11,
                    height: 22,
                    textTransform: "capitalize",
                    border: "none",
                  }}
                />
              );
            })}
          </Box>

          {/* Physical info */}
          <Grid container spacing={2}>
            {[
              { label: "height", value: pokemon.height },
              { label: "weight", value: pokemon.weight },
              { label: "base exp", value: pokemon.base_experience ?? "—" },
            ].map((item) => (
              <Grid item key={item.label}>
                <Typography
                  variant="caption"
                  color="text.primary"
                  display="block"
                >
                  {item.label}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={500}
          display="block"
          mb={1.5}
        >
          Base Stats
        </Typography>
        <Grid container spacing={1} sx={{ mb: 1, '& .MuiGrid-item': { padding: 0 } }}>
          {pokemon.stats.map((s: any) => {
            const statName = s.stat.name;
            const color = STAT_COLORS[statName] || "#888";
            const pct = Math.round((s.base_stat / 150) * 100);
            return (
              <Grid item xs={6} key={statName}>
                <Box
                  key={statName}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      width: 56,
                      flexShrink: 0,
                      textTransform: "uppercase",
                      fontSize: 10,
                    }}
                  >
                    {STAT_LABELS[statName] || statName}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    sx={{ width: 28, textAlign: "right", flexShrink: 0 }}
                  >
                    {s.base_stat}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: color,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Abilities */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={500}
          display="block"
          mb={1}
        >
          Abilities
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {pokemon.abilities.map((a: any) => (
            <Chip
              key={a.ability.name}
              label={
                a.is_hidden ? `${a.ability.name} (hidden)` : a.ability.name
              }
              size="small"
              variant="outlined"
              sx={{
                fontSize: 12,
                textTransform: "capitalize",
                color: a.is_hidden ? "text.secondary" : "text.primary",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Sprites */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={500}
          display="block"
          mb={1}
        >
          Sprites
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {[
            { src: spriteDefault, label: "default" },
            { src: spriteShiny, label: "shiny" },
            { src: spriteBack, label: "back" },
          ].map(
            (sprite) =>
              sprite.src && (
                <Box key={sprite.label} sx={{ textAlign: "center" }}>
                  <Box
                    component="img"
                    src={sprite.src}
                    alt={sprite.label}
                    sx={{ width: 62, height: 62, imageRendering: "pixelated" }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {sprite.label}
                  </Typography>
                </Box>
              ),
          )}
        </Box>
      </Box>

      {/* Moves */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="h6" color="text.primary" fontWeight={500}>
            Moves{" "}
            <Typography component="span" variant="h6" color="text.disabled">
              ({filteredMoves.length})
            </Typography>
          </Typography>
          <TextField
            size="small"
            placeholder="search moves..."
            value={moveSearch}
            onChange={(e) => setMoveSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 160,
              "& .MuiInputBase-root": { fontSize: 12, height: 32 },
              "& .MuiOutlinedInput-input": { py: 0.5 },
            }}
          />
        </Box>

        {filteredMoves.length === 0 ? (
          <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
            no moves found
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              height: 250,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {filteredMoves.map((move: any) => (
              <Chip
                key={move}
                label={move}
                size="small"
                sx={{
                  fontSize: 11,
                  height: 24,
                  textTransform: "capitalize",
                  bgcolor: "action.hover",
                  color: "text.primary",
                  border: "0.5px solid",
                  borderColor: "divider",
                  "& .MuiChip-label": { px: 1.25 },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
