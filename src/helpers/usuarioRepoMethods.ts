import ModelUsuario from "../models/modelUsuario";
import { padronizaResponseUsers } from "./padronizers/padronizeUsuario";

export const find = async (payload: any) => {
  const usuarios = await ModelUsuario.find(payload);
  return padronizaResponseUsers(usuarios);
};

export default {
  find,
};
