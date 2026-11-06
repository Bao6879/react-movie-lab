import Paper from "@mui/material/Paper";

export default function Panel({ children }) {
  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: "rgba(0,0,0,0.6)", borderRadius: 2, p: 2, height: "100%" }}
    >
      {children}
    </Paper>
  );
}
