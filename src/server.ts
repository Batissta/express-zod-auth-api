import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "./config/config";
import routeUsuarios from "./routes/routeUsuario";
import routeMotoristas from "./routes/routeMotorista";
import { typeDefs } from "./schemas/typeDefs";
import { resolvers } from "./resolvers/resolvers";
import { ApolloServer } from "apollo-server-express";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";

const app: express.Application | any = express();
// const documentacaoAPI = YAML.load("./swagger.yaml");
app.use(express.json());
app.use(cors());
app.use("/api/usuarios", routeUsuarios);
app.use("/api/motoristas", routeMotoristas);
// app.use("/", swaggerUi.serve, swaggerUi.setup(documentacaoAPI));

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
