import { render, screen } from "@testing-library/react";
import { vi, beforeEach, afterEach } from "vitest";
import PokemonList from "./PokemonList";

describe("PokemonList", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [
              { name: "pikachu", url: "url1" },
              { name: "bulbasaur", url: "url2" },
            ],
          }),
      }),
    ) as unknown as typeof fetch;
  });

  test("should render pokemon list heading", () => {
    render(<PokemonList />);
    expect(screen.getByText(/pokemon list/i)).toBeInTheDocument();
  });

  test("should show loading state initially", () => {
    render(<PokemonList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("should render pokemon names", async () => {
    render(<PokemonList />);
    const pokemon = await screen.findByText("pikachu");
    expect(pokemon).toBeInTheDocument();
  });
});
