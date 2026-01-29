import express from "express";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.json({ message: 'HTTP server is running!' });
});
app.use("/auth",authRoutes);
app.use("/room",roomRoutes);
app.listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});