import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useForm, Controller } from "react-hook-form";
import { useState, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router";

const ratings = [
  { value: 10, label: "10 - Transcendant" },
  { value: 9, label: "9 - Peak" },
  { value: 8, label: "8 - Fire" },
  { value: 7, label: "7 - Great" },
  { value: 6, label: "6 - Good" },
  { value: 5, label: "5 - Mid" },
  { value: 4, label: "4 - Bad" },
  { value: 3, label: "3 - Terrible" },
  { value: 2, label: "2 - Trash" },
  { value: 1, label: "1 - Horrendous" },
  { value: 0, label: "0 - Atrocious" },
];

const styles = {
  root: {
    marginTop: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  form: {
    width: "100%",
    "& > * ": {
      marginTop: 2,
    },
  },
  textField: {
    width: "40ch",
  },
  submit: {
    marginRight: 2,
  },
  snack: {
    width: "50%",
    "& > * ": {
      width: "100%",
    },
  },
};

const ReviewForm = ({ movie, onDone }) => {
  const context = useContext(MoviesContext);

  const [rating, setRating] = useState(5);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const defaultValues = {
    author: "",
    review: "",
    agree: false,
    rating: "5",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSnackClose = (event) => {
    setOpen(false);
  };

  const onSubmit = (formData) => {
    const review = {
      id: "mine",
      movieId: movie.id,
      author: formData.author,
      content: formData.review,
      created_at: new Date().toISOString(),
      author_details: {
        rating: rating,
      },
    };
    context.addReview(movie, review);
    setOpen(true);

    if (onDone) {
      onDone();
    }
  };

  return (
    <Box component="div" sx={styles.root}>
      <Snackbar
        sx={styles.snack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleSnackClose}
      >
        <MuiAlert
          severity="success"
          variant="filled"
          onClose={handleSnackClose}
        >
          <Typography variant="body1">
            Thank you for submitting a review
          </Typography>
        </MuiAlert>
      </Snackbar>

      <Box
        component="form"
        sx={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Controller
          name="author"
          control={control}
          rules={{ required: "Name is required" }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              sx={{ width: "40ch" }}
              variant="outlined"
              margin="normal"
              required
              onChange={onChange}
              value={value}
              id="author"
              label="Author's name"
              name="author"
              autoFocus
            />
          )}
        />
        {errors.author && (
          <Typography variant="h6" component="p">
            {errors.author.message}
          </Typography>
        )}
        <Controller
          name="review"
          control={control}
          rules={{
            required: "Review cannot be empty.",
            minLength: { value: 10, message: "Review is too short" },
          }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="review"
              value={value}
              onChange={onChange}
              label="Review text"
              id="review"
              multiline
              minRows={10}
            />
          )}
        />
        {errors.review && (
          <Typography variant="h6" component="p">
            {errors.review.message}
          </Typography>
        )}

        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange, value } }) => (
            <TextField
              id="select-rating"
              select
              variant="outlined"
              label="Rating Select"
              value={rating}
              onChange={handleRatingChange}
              helperText="Don't forget your rating"
            >
              {ratings.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box sx={styles.buttons}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={styles.submit}
          >
            Submit
          </Button>
          <Button
            type="reset"
            variant="contained"
            color="secondary"
            sx={styles.submit}
            onClick={() => {
              reset({
                author: "",
                review: "",
              });
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewForm;
