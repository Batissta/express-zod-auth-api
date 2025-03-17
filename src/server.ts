import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "./config/config";
import routeUsuarios from "./routes/routeUsuario";
import { typeDefs } from "./schemas/typeDefs";
import { resolvers } from "./resolvers/resolvers";
import { ApolloServer } from "apollo-server-express";

const app: express.Application | any = express();
app.use(express.json());
app.use(cors());
app.use("/api/usuarios", routeUsuarios);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose.connect(env.DB_STRING_CONNECTION).then(() => {
  console.log("🎈 Mongodb database initialized!");
  app.emit("DATABASE_CONNECTED");
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  console.log("GraphQL is running!");
  app.listen(env.PORT, () => {
    console.log(
      `🚀 HTTP Server is running!\n📌 Use this API at the follow link: http://localhost:${env.PORT}${server.graphqlPath}`
    );
  });
};

app.on("DATABASE_CONNECTED", () => {
  startServer();
});

app.get("/", async (_req: any, res: any) => {
  res.status(200).json({
    message:
      "Welcome to my API!👋🏽 I'm Francinaldo Batista and you can access the docs of this API at my github! Let's connect at linkedin: https://linkedin.com/in/francinaldobatista",
  });
});
