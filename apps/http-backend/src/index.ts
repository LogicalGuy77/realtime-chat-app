import express from "express";
import cors from "cors";
import { mainRouter } from "./routes/mainrouter.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", mainRouter);
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
