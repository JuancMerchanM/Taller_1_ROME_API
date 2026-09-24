import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.use(cors());
app.use(express.json());

app.use("/swagger", express.static("public/swagger"));

app.get("/api-docs", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Total War: Rome II API - Swagger</title>

        <link
          rel="stylesheet"
          type="text/css"
          href="/swagger/swagger-ui.css"
        />
      </head>

      <body>
        <div id="swagger-ui"></div>

        <script src="/swagger/swagger-ui-bundle.js"></script>
        <script src="/swagger/swagger-ui-standalone-preset.js"></script>

        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: "/api-docs.json",
              dom_id: "#swagger-ui",
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
});

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
  res.json({
    success: true,
    message: "Total War: Rome II API"
  });
});

await connectDB(process.env.MONGODB_URI);

export default app;
