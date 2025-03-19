import { Router } from "express";
import {
  criarMotorista,
  updateMotoristaById,
  findById,
  deleteById,
} from "../controllers/controllerMotorista";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router.route("/").post(criarMotorista);

router.route("/:id").get(findById).put(updateMotoristaById).delete(deleteById);

export default router;
