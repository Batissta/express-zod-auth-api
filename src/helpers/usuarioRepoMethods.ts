import ModelUsuario from "../models/ModelUsuario";
import { padronizaResponseUsers } from "./padronizeUsuario";

export const find = async (payload: any) => {
  const usuarios = await ModelUsuario.find(payload);
  return padronizaResponseUsers(usuarios);
};

export default {
  find,
};
