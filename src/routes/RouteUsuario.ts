import { Router } from "express";
import controller from "../controllers/ControllerUsuarios";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router
  .route("/")
  .get(async (req, res) => {
    return await controller.listaUsuarios(req, res);
  })
  .post(controller.criarUsuario);

router.route("/login").post(controller.login);

export default router;
