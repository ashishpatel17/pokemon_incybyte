import { Container, Typography } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";

export default function App() {
  return (
    <HashRouter future={{ v7_relativeSplatPath: true }}>
      <Container maxWidth={false} disableGutters sx={{ width: "100%" }}>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/detail/:pokemonId" element={<PokemonDetail />} />
        </Routes>
      </Container>
    </HashRouter>
  );
}
