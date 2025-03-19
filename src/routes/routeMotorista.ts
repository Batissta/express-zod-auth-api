import { Router } from "express";
import {
  criarMotorista,
  updateMotoristaById,
  findById,
  deleteById,
  findAll,
} from "../controllers/controllerMotorista";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router.route("/").get(findAll).post(criarMotorista);

router.route("/:id").get(findById).put(updateMotoristaById).delete(deleteById);

export default router;
