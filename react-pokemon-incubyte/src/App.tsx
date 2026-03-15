import { Container, Typography } from "@mui/material";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Container>
       
        <Routes>
          <Route path="/" element={<PokemonList />} />
        </Routes>
        <Routes>
          <Route path="/detail/:id" element={<PokemonDetail />} />
        </Routes>

      </Container>
    </BrowserRouter>
  );
}