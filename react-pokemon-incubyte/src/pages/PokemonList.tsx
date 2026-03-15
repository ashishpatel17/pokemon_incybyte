import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  AppDispatch,
} from "../state/reducer/pokemonSlice";
import {fetchPokemon, fetchPokemonByType , fetchTypes} from "../services/api";
import type { RootState } from "../state/store";
import { useDispatch, useSelector} from "react-redux";
import ListItem from "../components/ListItem";
import { useEffect, useRef, useState } from "react";

export default function PokemonList() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, count } = useSelector(
    (state: RootState) => state.pokemon,
  );
  const { types } = useSelector((state: RootState) => state.types);
  const results = list;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const pageSize = 20;
  const hasFetchedPokemon = useRef(false);
  const hasFetchedTypes = useRef(false);
  const displayResults = selectedType
    ? list.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : results;
  const displayCount = selectedType ? list.length : count;

  useEffect(() => {
    if (selectedType === "") {
      dispatch(fetchPokemon({ pageNum: currentPage, pageSize }));
    }
  }, [dispatch, currentPage, selectedType]);

  useEffect(() => {
    if (!hasFetchedTypes.current) {
      dispatch(fetchTypes());
      hasFetchedTypes.current = true;
    }
  }, [dispatch]);

  return (
    <Container maxWidth="lg" disableGutters>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokemon List ({displayCount})
          </Typography>
          <FormControl
            size="small"
            sx={{
              minWidth: 220,
              "& .MuiInputLabel-root": {
                color: "white",
                "&.Mui-focused": { color: "white" },
                "&.MuiFormLabel-filled": { color: "white" },
              },
              "& .MuiOutlinedInput-root": {
                "& .MuiSelect-select": { color: "white" },
                "& .Mui-focused": { color: "white" },
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
          >
            <InputLabel id="pokemon-type-label">Pokemon Type</InputLabel>
            <Select
              labelId="pokemon-type-label"
              id="pokemon-type-select"
              label="Pokemon Type"
              value={selectedType || "All"}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "All") {
                  setSelectedType("");
                  setCurrentPage(1);
                } else {
                  dispatch(fetchPokemonByType(Number(value)));
                  setSelectedType(value);
                  setCurrentPage(1);
                }
              }}
            >
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>
              {types.map((type: any) => (
                <MenuItem
                  key={type.name}
                  value={type.url.split("/").filter(Boolean).pop()}
                >
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <ListItem data={displayResults} />
        </div>
        <div
          className="paggination"
          style={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            padding: "15px 0px 5px 0px",
            position: "sticky",
            bottom: 0,
            backgroundColor: "#1976d2",
            zIndex: 1000,
          }}
        >
          <Pagination
            count={Math.ceil(displayCount / pageSize)}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            sx={{ "& .MuiPaginationItem-root": { color: "white" } }}
          />
        </div>
      </div>
    </Container>
  );
}

// Helper component to fetch and show pokemon image
