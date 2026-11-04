import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import img from "../../images/film-poster-placeholder.png";
import { Link } from "react-router";
import Box from "@mui/material/Box";

export default function PersonCard({ person }) {
  let profileUrl = img;
  if (person.image) {
    profileUrl = `https://image.tmdb.org/t/p/w500/${person.image}`;
  }

  const knownFor = person.known_for.map((item) => {
    if (item.media_type === "movie") {
      return item.title;
    }
    return item.name;
  });

  return (
    <Card
      sx={{
        transition: "transform 300ms ease, box-shadow 300ms ease",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 5,
        },
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="body1"
            component="p"
            sx={{ textAlign: "center", fontWeight: "bolder" }}
          >
            {person.title}
          </Typography>
        }
      />
      <Link to={`/people/${person.id}`}>
        <CardMedia sx={{ height: 500 }} image={profileUrl} />
      </Link>
      <CardContent>
        <Box>
          <Typography
            variant="h6"
            component="p"
            sx={{ fontStyle: "italic", textAlign: "center" }}
          >
            {person.known_for_department}
          </Typography>
          <Typography
            variant="body2"
            component="p"
            noWrap
            sx={{ textAlign: "center", mt: 1 }}
          >
            Known for: {knownFor.length >= 1 ? knownFor[0] : "-"}
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}
          >
            Popularity: {Math.round(person.popularity)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
