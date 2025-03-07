import { Router } from "express";
import {
  listaUsuarios,
  login,
  criarUsuario,
  encontraPeloTipo,
} from "../controllers/ControllerUsuarios";
// import { criarPassageiro } from "../controllers/usuariosTipo/ControllerPassageiro";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router.route("/").get(listaUsuarios).post(criarUsuario);

router.route("/:tipo").get(encontraPeloTipo);

router.route("/login").post(login);

export default router;
