import env from "./config/config";
import jwt from "jsonwebtoken";

const authRoutes = [
  // { route: "/api/usuarios", method: "GET" },
  { route: "/api/usuarios/:id", method: "GET" },
  { route: "/api/usuarios/:id", method: "PUT" },
  { route: "/api/usuarios/:id", method: "DELETE" },
];

export const middleware = async (req: any, res: any, next: any) => {
  const IsAprivateRoute = authRoutes.some((authRoutesObject) => {
    const route = authRoutesObject.route.split(":")[0];
    return (
      authRoutesObject.method == req.method &&
      req.originalUrl.includes(route) &&
      req.originalUrl.split("/").length > 3 &&
      !(req.originalUrl.includes("/login") || req.originalUrl.includes("/tipo"))
    );
  });

  if (!IsAprivateRoute) return next();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Formato do token inválido" });
  }

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, env.SECRET, (err: unknown, result: any) => {
      if (err && err instanceof Error)
        return res.status(401).json({
          message: "Token inválido!",
        });
      next();
    });
  } catch (error: any) {
    res.status(500).json({ mensagem: error.message });
  }
};
