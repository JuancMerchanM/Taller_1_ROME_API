import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import connectDB from "./driver/mongodb.mjs";
import swaggerSpec from "./config/swagger.mjs";

import authRoutes from "./authentication/authRoutes.mjs";
import factionRoutes from "./routes/factionRoutes.mjs";
import campaignRoutes from "./routes/campaignRoutes.mjs";
import armyRoutes from "./routes/armyRoutes.mjs";
import generalRoutes from "./routes/generalRoutes.mjs";
import skillRoutes from "./routes/skillRoutes.mjs";
import unitRoutes from "./routes/unitRoutes.mjs";
import strategyRoutes from "./routes/strategyRoutes.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/factions", factionRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/armies", armyRoutes);
app.use("/api/generals", generalRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/strategies", strategyRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Total War: Rome II API" });
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();

export default app;
