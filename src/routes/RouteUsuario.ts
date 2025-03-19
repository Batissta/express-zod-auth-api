import { Router } from "express";
import {
  createUser,
  findById,
  findUsers,
  login,
  updateUser,
  deleteById,
} from "../controllers/controllerUsuario";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router.route("/").get(findUsers).post(createUser);

router.route("/:id").get(findById).put(updateUser).delete(deleteById);

router.route("/login").post(login);

export default router;
