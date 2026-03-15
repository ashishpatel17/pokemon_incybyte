import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi, describe, test, expect, beforeEach } from "vitest";
import PokemonDetail from "./PokemonDetail";

const mockCharmeleon = {
  id: 5,
  name: "charmeleon",
  height: 11,
  weight: 190,
  base_experience: 142,
  types: [
    {
      slot: 1,
      type: { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
    },
  ],
  stats: [
    { base_stat: 58, effort: 0, stat: { name: "hp" } },
    { base_stat: 64, effort: 0, stat: { name: "attack" } },
    { base_stat: 58, effort: 0, stat: { name: "defense" } },
    { base_stat: 80, effort: 1, stat: { name: "special-attack" } },
    { base_stat: 65, effort: 0, stat: { name: "special-defense" } },
    { base_stat: 80, effort: 1, stat: { name: "speed" } },
  ],
  abilities: [
    { ability: { name: "blaze", url: "" }, is_hidden: false, slot: 1 },
    { ability: { name: "solar-power", url: "" }, is_hidden: true, slot: 3 },
  ],
  moves: [
    { move: { name: "scratch", url: "" } },
    { move: { name: "ember", url: "" } },
    { move: { name: "flamethrower", url: "" } },
    { move: { name: "slash", url: "" } },
    { move: { name: "dragon-rage", url: "" } },
    { move: { name: "scratch", url: "" } },
  ],
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
    front_shiny:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/5.png",
    back_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/5.png",
    other: {
      "official-artwork": {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
      },
    },
  },
  species: { name: "charmeleon", url: "" },
};

function makeStore(selected: any = null) {
  return configureStore({
    reducer: {
      pokemon: () => ({
        selected,
        list: [],
        loading: false,
        count: 0,
        error: null,
      }),
    },
  });
}

function renderWithStore(selected: any = null) {
  const store = makeStore(selected);
  return render(
    <Provider store={store}>
      <PokemonDetail />
    </Provider>,
  );
}

describe("PokemonDetail", () => {
  describe("when no pokemon is selected", () => {
    test("shows fallback message", () => {
      renderWithStore(null);
      expect(screen.getByText("No Pokémon selected")).toBeInTheDocument();
    });
  });

  describe("identity", () => {
    beforeEach(() => {
      renderWithStore(mockCharmeleon);
    });

    test("renders pokemon name", () => {
      const img = screen.getByAltText("charmeleon");
      expect(screen.getByText("charmeleon")).toBeInTheDocument();
      expect(screen.getByText("#5")).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        mockCharmeleon.sprites.other["official-artwork"].front_default,
      );
    });
  });

  describe("verify pokemon type badge", () => {
    test("renders fire type chip", () => {
      renderWithStore(mockCharmeleon);

      expect(screen.getByText("fire")).toBeInTheDocument();
    });

    test("renders all types for multi-type pokemon", () => {
      const dualType = {
        ...mockCharmeleon,
        types: [
          { slot: 1, type: { name: "fire", url: "" } },
          { slot: 2, type: { name: "flying", url: "" } },
        ],
      };
      renderWithStore(dualType);
      expect(screen.getByText("fire")).toBeInTheDocument();
      expect(screen.getByText("flying")).toBeInTheDocument();
    });
  });

  describe("verify physical info", () => {
    beforeEach(() => {
      renderWithStore(mockCharmeleon);
    });

    test("vertfy height , weight & base experience", () => {
      expect(screen.getByText("11")).toBeInTheDocument();
      expect(screen.getByText("190")).toBeInTheDocument();
      expect(screen.getByText("142")).toBeInTheDocument();
    });
  });

  describe("base stats", () => {
    beforeEach(() => {
      renderWithStore(mockCharmeleon);
    });

    test("check for pokemon stats label", () => {
      expect(screen.getByText("HP")).toBeInTheDocument();
      expect(screen.getByText("ATK")).toBeInTheDocument();
      expect(screen.getByText("DEF")).toBeInTheDocument();
      expect(screen.getByText("SP.ATK")).toBeInTheDocument();
      expect(screen.getByText("SP.DEF")).toBeInTheDocument();
      expect(screen.getByText("SPD")).toBeInTheDocument();
    });
  });

  describe("abilities", () => {
    beforeEach(() => {
      renderWithStore(mockCharmeleon);
    });

    test("renders normal ability & hidden ability", () => {
      expect(screen.getByText("blaze")).toBeInTheDocument();
      expect(screen.getByText("solar-power (hidden)")).toBeInTheDocument();
    });
  });

  describe("sprites", () => {
    beforeEach(() => {
      renderWithStore(mockCharmeleon);
    });

    test("renders pokemon sprite", () => {
      const img = screen.getByAltText("default");
      expect(screen.getByAltText("default")).toBeInTheDocument();
      expect(screen.getByAltText("shiny")).toBeInTheDocument();
      expect(screen.getByAltText("back")).toBeInTheDocument();

      expect(img).toHaveAttribute("src", mockCharmeleon.sprites.front_default);
    });

  });
});
