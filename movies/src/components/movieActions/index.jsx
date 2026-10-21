import AddToFavoritesIcon from "../cardIcons/addToFavorites";
import AddToWatchlistIcon from "../cardIcons/addToWatchlist";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { useState } from "react";

export default function MovieActions({ movie }) {
  const [anchor, setAnchor] = useState(null);
  const handleMenu = (event) => {
    setAnchor(event.currentTarget);
  };
  return (
    <>
      <IconButton onClick={handleMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem onClick={() => setAnchor(null)}>
          <AddToFavoritesIcon movie={movie} />
          Add to Favourite
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>
          <AddToWatchlistIcon movie={movie} />
          Add to Watchlist
        </MenuItem>
      </Menu>
    </>
  );
}
