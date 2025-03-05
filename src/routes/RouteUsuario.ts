import { Router } from "express";
import UsuarioRepository from "../models/ModelUsuario";

const router = Router();

router.route("/").get(async (req, res) => {
  const users = await UsuarioRepository.find();
  res.status(200).json({
    quantidade: users.length,
    usuarios: users,
  });
});

export default router;
