import { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AddToSeenIcon = ({ movie }) => {
  const context = useContext(MoviesContext);

  const handleAddToSeen = (e) => {
    e.preventDefault();
    context.addToSeen(movie);
  };

  return (
    <IconButton aria-label="add to seen" onClick={handleAddToSeen}>
      <VisibilityIcon color="primary" fontSize="medium" />
    </IconButton>
  );
};

export default AddToSeenIcon;
