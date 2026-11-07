import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import { Link as RouterLink } from "react-router";
import img from "../../images/film-poster-placeholder.png";

export default function PersonCredits({ person }) {
  const [page, setPage] = useState(1);

  let credits = person.combined_credits.cast;
  if (person.known_for_department !== "Acting")
    credits = person.combined_credits.crew;
  // copy first: .sort() changes the array itself, and this one lives in the query cache
  credits = [...credits].sort((a, b) => {
    return b.vote_count - a.vote_count;
  });
  const pageCredits = credits.slice((page - 1) * 10, page * 10);
  const pageCount = Math.ceil(credits.length / 10);

  return (
    <Box>
      {/* one row per credit, with a line between them */}
      <Stack divider={<Divider flexItem />} spacing={1.5}>
        {pageCredits.map((c) => (
          <Box
            key={c.credit_id}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            {/* small poster */}
            <Box
              component="img"
              src={
                c.poster_path != undefined
                  ? `https://image.tmdb.org/t/p/w92` + c.poster_path
                  : img
              }
              sx={{
                width: 60,
                flexShrink: 0,
                aspectRatio: "2 / 3",
                objectFit: "cover",
                display: "block",
                borderRadius: 1,
              }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Link
                component={RouterLink}
                to={
                  c.media_type === "movie"
                    ? `/movies/${c.id}`
                    : `/shows/${c.id}`
                }
                color="info.light"
                underline="hover"
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
              >
                {c.title || c.name}
              </Link>
              <Typography variant="body2" sx={{ color: "warning.light" }}>
                {(c.media_type === "movie"
                  ? c.release_date
                  : c.first_air_date) +
                  " • " +
                  (c.character || c.job)}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ flexShrink: 0 }}>
              {c.vote_average.toFixed(1)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(event, value) => {
            setPage(value);
          }}
        />
      </Box>
    </Box>
  );
}
