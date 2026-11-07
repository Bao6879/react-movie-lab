import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MoviesContext } from "../../contexts/moviesContext";

const RemoveFromSeenIcon = ({ movie }) => {
  const context = useContext(MoviesContext);

  const handleRemoveFromSeen = (e) => {
    e.preventDefault();
    context.removeFromSeen(movie);
  };
  return (
    <IconButton aria-label="remove from seen" onClick={handleRemoveFromSeen}>
      <VisibilityOffIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromSeenIcon;
