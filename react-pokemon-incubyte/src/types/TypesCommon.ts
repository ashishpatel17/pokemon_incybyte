export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
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

export const STAT_COLORS: Record<string, string> = {
  hp: "#E24B4A",
  attack: "#EF9F27",
  defense: "#378ADD",
  "special-attack": "#7F77DD",
  "special-defense": "#1D9E75",
  speed: "#D4537E",
};

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};