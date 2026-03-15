import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi, beforeEach, afterEach } from "vitest";
import PokemonList from "./PokemonList";
import { Provider } from "react-redux";
import { store } from "../state/store";
import axios from "axios";
import userEvent from "@testing-library/user-event";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

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
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>,
    );
    expect(screen.getByText(/pokemon list/i)).toBeInTheDocument();
  });

  test("should show loading state initially", () => {
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>,
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test("should render pokemon names", async () => {
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>,
    );
    const pokemon = await screen.findByText("pikachu1");
    expect(pokemon).toBeInTheDocument();
  });

  it("should show pagination", async () => {
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>,
    );
    await screen.findByText("pikachu1");
    const pagination = await screen.findByRole("navigation");
    const pageOne = within(pagination).getByRole("button", {
      name: /page 1/i,
    });
    expect(pageOne).toBeInTheDocument();
  });

  test("should render pokemon type dropdown with options", async () => {
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>,
    );
    const select = screen.getByRole("combobox", { name: /pokemon type/i });
    expect(select).toBeInTheDocument();

    fireEvent.mouseDown(select);

    expect(screen.getByText("normal")).toBeInTheDocument();
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
                results: [{ name: "pikachu1", url: "url/pikachu1" }],
              },
            });
          }
        }, 100),
      );
    });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>,
    );

    await screen.findByText("pikachu1");

    const select = screen.getByRole("combobox", { name: /pokemon type/i });
    await user.click(select);
    await user.click(screen.getByText("fire"));

    await screen.findByText("charmander");
    expect(screen.getByText("charmander")).toBeInTheDocument();
  });
});
