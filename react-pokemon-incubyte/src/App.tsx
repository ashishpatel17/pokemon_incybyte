import { Container, Typography } from "@mui/material";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList";

export default function App() {
  return (
    <BrowserRouter>
      <Container>
        <Typography variant="h4" sx={{ mb: 4 }}>
          React MUI Project
        </Typography>

        <Routes>
          <Route path="/" element={<PokemonList />} />
        </Routes>

      </Container>
    </BrowserRouter>
  );
}