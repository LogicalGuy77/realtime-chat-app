import express from "express";
import cors from "cors";
import { mainRouter } from "./routes/mainrouter.js"; // Ensure this path is correct after build
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);

const port = process.env.PORT || 3002; // Use Render's port or fallback to 3002

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
