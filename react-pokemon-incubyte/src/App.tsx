import { Container, Typography } from "@mui/material";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList";

export default function App() {
  return (
    <BrowserRouter>
      <Container>
       
        <Routes>
          <Route path="/" element={<PokemonList />} />
        </Routes>

      </Container>
    </BrowserRouter>
  );
}