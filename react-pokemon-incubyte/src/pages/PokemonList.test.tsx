import { render, screen } from "@testing-library/react";
import { vi, beforeEach, afterEach } from "vitest";
import PokemonList from "./PokemonList";
import { Provider } from "react-redux";
import { store } from "../state/store";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("PokemonList", () => {
  beforeEach(() => {
    (axios.get as any).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  count: 2,
                  results: [
                    { name: "pikachu", url: "url1" },
                    { name: "bulbasaur", url: "url2" },
                  ],
                },
              }),
            100,
          ),
        ),
    );
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
    const pokemon = await screen.findByText("pikachu");
    expect(pokemon).toBeInTheDocument();
  });
});
