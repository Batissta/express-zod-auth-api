import { Router } from "express";
import {
  createUser,
  findById,
  findByType,
  findUsers,
  login,
  updateUser,
} from "../controllers/controllerUsuario";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router.route("/").get(findUsers).post(createUser);

router.route("/:id").get(findById).put(updateUser);

router.route("/tipo/:tipo").get(findByType);

router.route("/login").post(login);

export default router;
