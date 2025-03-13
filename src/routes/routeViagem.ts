import { Router } from "express";
import { createViagem, findViagens } from "../controllers/controllerViagem";
import { middleware } from "../middleware";

const router = Router();

router.use(middleware);

router.route("/").get(findViagens).post(createViagem);

// router.route("/:id").get(findById);

// router.route("/:motoristaId").get(findByType);

export default router;
