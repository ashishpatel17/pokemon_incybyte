import { render, screen, fireEvent, within } from "@testing-library/react";
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
                  count: 60,
                  results: Array.from({ length: 60 }, (_, i) => ({
                    name: `pikachu${i + 1}`,
                    url: `url${i + 1}`,
                  })),
                },
              }),
            100,
          ),
        ),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
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
});
