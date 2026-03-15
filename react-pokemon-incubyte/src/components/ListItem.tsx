import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { Link } from "react-router-dom";

interface PokemonItem {
  name: string;
  url: string;
}

interface ListItemProps {
  data: PokemonItem[];
}

export default function ListItem({ data }: ListItemProps) {
  return (
    <>
      <Grid  container spacing={2}>
        {data.map((item) => (
          <Grid key={item.name} item xs={3}>
            <Card
              sx={{ maxWidth: 200, margin: "auto", marginBottom: 2 }}
            >
              <CardActionArea component={Link} to={`/detail/${item.url.split('/').filter(Boolean).pop()}`}>
                <PokemonImage name={item.name} url={item.url} />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function PokemonImage({ name, url }: { name: string; url: string }) {
  const [img, setImg] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setImg(data.sprites.front_default);
      } catch (error) {
        console.error(error);
      }
    }, 1000); // debounce delay
    return () => clearTimeout(timeoutId);
  }, [url]);
  if (!img)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 140,
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );

  return <CardMedia component="img" height="140" image={img} alt={name} />;
}
