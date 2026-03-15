import {
  Grid,
  CircularProgress,
  Alert,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPokemon, AppDispatch } from "../state/reducer/pokemonSlice";
import type { RootState } from "../state/store";
import ListItem from "../components/ListItem";

export default function PokemonList() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, count } = useSelector(
    (state: RootState) => state.pokemon,
  );
  const results = list;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    dispatch(fetchPokemon({ pageNum: currentPage, pageSize }));
  }, [dispatch, currentPage]);

  return (
    <Container maxWidth="md">
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div">
            Pokemon List ({count})
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 24 }}>
        <div className="content">
          {loading && (
            <>
              <CircularProgress />
              Loading...
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <ListItem
            data={results}
          />
        </div>
        <div
        className="paggination"
          style={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            padding: "15px 0px 5px 0px",
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#1976d2',
            zIndex: 1000,
          }}
        >
          <Pagination
            count={Math.ceil(count / pageSize)}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
          />
        </div>
      </div>
    </Container>
  );
}

// Helper component to fetch and show pokemon image
