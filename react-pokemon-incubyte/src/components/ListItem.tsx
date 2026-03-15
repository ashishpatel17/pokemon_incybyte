import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";

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
          <Grid item xs={3}>
            <Card
              key={item.name}
              sx={{ maxWidth: 200, margin: "auto", marginBottom: 2 }}
            >
              <CardActionArea>
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
    async function fetchImg() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setImg(data.sprites.front_default);
      } catch {}
    }
    fetchImg();
  }, [url]);
  if (!img) return <CircularProgress size={24} />;
  return <CardMedia component="img" height="140" image={img} alt={name} />;
}
