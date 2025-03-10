import env from "./config/config";
import jwt from "jsonwebtoken";

const authRoutes = [
  { route: "/api/usuarios", method: "GET" },
  { route: "/api/usuarios:id", method: "GET PUT" },
];

export const middleware = async (req: any, res: any, next: any) => {
  // if (req.method !== "PUT") return next();

  const IsAprivateRoute = authRoutes.some((authRoutesObject) => {
    return (
      authRoutesObject.route == req.originalUrl &&
      authRoutesObject.method == req.method
    );
  });

  if (!IsAprivateRoute) return next();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Formato do token inválido" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const result = jwt.verify(token, env.SECRET);
    req.usuarioId = result;
    next();
  } catch (error: any) {
    res.status(500).json({ mensagem: error.message });
  }
};
