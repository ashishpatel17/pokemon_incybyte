import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  InputAdornment,
  TextField,
  Avatar,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetail } from "../services/api";
import type { RootState, AppDispatch } from "../state/store";
import { TYPE_COLORS, STAT_COLORS, STAT_LABELS } from "../types/TypesCommon";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
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
        maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: 600 },
        mx: "auto",
        mt: 0,
        mb: 4,
        borderRadius: 3,
        border: "0.5px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textTransform: "capitalize",
              fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" },
            }}
          >
            {pokemon.name}
          </Typography>
          <IconButton color="inherit" edge="end" onClick={() => navigate("/")}>
            <ArrowBack />
          </IconButton>
        </Toolbar>
      </AppBar>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                fontWeight={500}
                textTransform="capitalize"
                sx={{ fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" } }}
              >
                {pokemon.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", lg: "0.95rem" } }}
              >
                #{pokemon.id}
              </Typography>
            </Box>
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
                    fontSize: { xs: "0.65rem", sm: "0.7rem", lg: "0.75rem" },
                    height: { xs: 20, sm: 22, lg: 24 },
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
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.8rem" } }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" } }}
                >
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
          sx={{ fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" } }}
        >
          Base Stats
        </Typography>
        <Grid
          container
          spacing={1}
          sx={{ mb: 1, "& .MuiGrid-item": { padding: 0 } }}
        >
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
                      fontSize: { xs: "0.6rem", sm: "0.65rem", lg: "0.7rem" },
                    }}
                  >
                    {STAT_LABELS[statName] || statName}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={500}
                    sx={{
                      width: 28,
                      textAlign: "right",
                      flexShrink: 0,
                      fontSize: { xs: "0.65rem", sm: "0.7rem", lg: "0.75rem" },
                    }}
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
          sx={{ fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" } }}
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
                fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.8rem" },
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
          sx={{ fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" } }}
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
                    sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", lg: "0.75rem" } }}
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
          <Typography
            variant="h6"
            color="text.primary"
            fontWeight={500}
            sx={{ fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" } }}
          >
            Moves{" "}
            <Typography
              component="span"
              variant="h6"
              color="text.disabled"
              sx={{ fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" } }}
            >
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
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.75rem", sm: "0.8rem", lg: "0.875rem" },
                height: 32,
              },
              "& .MuiOutlinedInput-input": { py: 0.5 },
            }}
          />
        </Box>

        {filteredMoves.length === 0 ? (
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ py: 1, fontSize: { xs: "0.8rem", sm: "0.875rem", lg: "0.95rem" } }}
          >
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
                  fontSize: { xs: "0.65rem", sm: "0.7rem", lg: "0.75rem" },
                  height: { xs: 22, sm: 24, lg: 26 },
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
