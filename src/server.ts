import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "./config/config";
import RouteUsuarios from "./routes/RouteUsuario";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/usuarios", RouteUsuarios);

mongoose.connect(env.DB_STRING_CONNECTION).then(() => {
  console.log("🎈 Mongodb database initialized!");
  app.emit("DATABASE_CONNECTED");
});

app.on("DATABASE_CONNECTED", () => {
  app.listen(env.PORT, () => {
    console.log(`🚀 HTTP Server is running!`);
    console.log(
      `📌 Use this API at the follow link: http://localhost:${env.PORT}`
    );
  });
});

app.get("/", async (_req, res) => {
  res.status(200).json({
    message:
      "Welcome to my API!👋🏽 I'm Francinaldo Batista and you can access the docs of this API at my github! Let's connect at linkedin: https://linkedin.com/in/francinaldobatista",
  });
});
