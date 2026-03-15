import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi, beforeEach, afterEach } from "vitest";
import PokemonList from "./PokemonList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import pokemonReducer from "../state/reducer/pokemonSlice";
import typeReducer from "../state/reducer/typeSlice";

const { axiosMock } = vi.hoisted(() => {
  const mock:any = {
    get: vi.fn(),
    create: vi.fn(() => mock),
  };

  return { axiosMock: mock };
});

vi.mock("axios", () => ({
  default: axiosMock,
}));

function makeStore() {
  return configureStore({
    reducer: {
      pokemon: pokemonReducer,
      types: typeReducer,
    },
  });
}

function renderWithProviders() {
  const store = makeStore();

  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Provider store={store}>
        <PokemonList />
      </Provider>
    </MemoryRouter>,
  );
}

describe("PokemonList", () => {
  beforeEach(() => {
    (global as any).fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ sprites: { front_default: "image-url" } }),
      }),
    );

    (axios.get as any).mockImplementation((url: string) => {
      return new Promise((resolve) =>
        setTimeout(() => {
          if (url.includes("/pokemon")) {
            resolve({
              data: {
                count: 60,
                results: Array.from({ length: 60 }, (_, i) => ({
                  name: `pikachu${i + 1}`,
                  url: `https://pokeapi.co/${i + 1}`,
                })),
              },
            });
          } else if (url.includes("/type")) {
            resolve({
              data: {
                results: [
                  { name: "normal", url: "url/normal" },
                  { name: "fire", url: "url/fire" },
                  { name: "grass", url: "url/grass" },
                  { name: "ice", url: "url/ice" },
                ],
              },
            });
          } else {
            resolve({ data: {} });
          }
        }, 100),
      );
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).fetch;
  });

  test("should render pokemon list heading", () => {
    renderWithProviders();
    expect(screen.getByText(/pokemon list/i)).toBeInTheDocument();
  });

  test("should show loading state initially", () => {
    renderWithProviders();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test("should render pokemon names", async () => {
    renderWithProviders();
    const pokemon = await screen.findByText("pikachu1");
    expect(pokemon).toBeInTheDocument();
  });

  it("should show pagination", async () => {
    renderWithProviders();
    await screen.findByText("pikachu1");
    const pagination = await screen.findByRole("navigation");
    const pageOne = within(pagination).getByRole("button", {
      name: /page 1/i,
    });
    expect(pageOne).toBeInTheDocument();
  });

  test("should render pokemon type dropdown with options", async () => {
    renderWithProviders();
    const select = screen.getByRole("combobox", { name: /pokemon type/i });
    expect(select).toBeInTheDocument();

    fireEvent.mouseDown(select);

    expect(await screen.findByText("normal")).toBeInTheDocument();
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("ice")).toBeInTheDocument();
  });

  test("should load fire type pokemon on selecting fire", async () => {
    (axios.get as any).mockImplementation((url: string) => {
      return new Promise((resolve) =>
        setTimeout(() => {
          if (url.includes("/type/10")) {
            resolve({
              data: {
                pokemon: [{ pokemon: { name: "charmander", url: "url" } }],
              },
            });
          } else if (url.includes("/type")) {
            resolve({
              data: {
                results: [
                  { name: "normal", url: "https://pokeapi.co/api/v2/type/1/" },
                  { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
                  { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
                  { name: "ice", url: "https://pokeapi.co/api/v2/type/15/" },
                ],
              },
            });
          } else {
            // handle initial pokemon list fetch
            resolve({
              data: {
                count: 1,
                results: [{ name: "pikachu1", url: "url/pikachu1" }],
              },
            });
          }
        }, 100),
      );
    });

    const user = userEvent.setup();

    renderWithProviders();

    await screen.findByText("pikachu1");
  await screen.findByRole("combobox", { name: /pokemon type/i });

    const select = screen.getByRole("combobox", { name: /pokemon type/i });
    await user.click(select);
  await user.click(await screen.findByText("fire"));

    await screen.findByText("charmander");
    expect(screen.getByText("charmander")).toBeInTheDocument();
  });
});
