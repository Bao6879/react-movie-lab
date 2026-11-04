import React from "react";
import Movie from "../movieCard/";
import Show from "../showCard/";
import Person from "../personCard";
import Grid from "@mui/material/Grid";

const ContentList = (props) => {
  let cards = props.items.map((m) =>
    m.type === "movie" ? (
      <Grid
        key={m.id}
        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
        sx={{ padding: "20px" }}
      >
        <Movie key={m.id} movie={m} action={props.action} />
      </Grid>
    ) : m.type === "show" ? (
      <Grid key={m.id} size={12} sx={{ padding: "20px" }}>
        <Show key={m.id} show={m} action={props.action} />
      </Grid>
    ) : (
      <Grid
        key={m.id}
        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
        sx={{ padding: "20px" }}
      >
        <Person key={m.id} person={m} />
      </Grid>
    ),
  );
  return cards;
};

export default ContentList;
