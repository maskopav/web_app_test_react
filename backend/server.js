// server.js
import express from "express";
import mappingsRouter from "./src/routes/mappings.js";
import protocolsRouter from "./src/routes/protocols.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/mappings", mappingsRouter);
app.use("/api/protocols", protocolsRouter); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
