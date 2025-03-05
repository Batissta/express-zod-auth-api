import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DB_STRING_CONNECTION: z.string().url().nonempty(),
  PORT: z.string().nonempty(),
});

interface Env {
  DB_STRING_CONNECTION: string;
  PORT: string;
}

const env: Env = envSchema.parse(process.env);

export default env;
