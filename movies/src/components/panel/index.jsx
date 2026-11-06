import Paper from "@mui/material/Paper";

export default function Panel({ children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: 2,
        padding: 2,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Paper>
  );
}
