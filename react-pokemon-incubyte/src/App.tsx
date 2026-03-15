import { Container, Typography } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";

export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Container>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/detail/:pokemonId" element={<PokemonDetail />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
