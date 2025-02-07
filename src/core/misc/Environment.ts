import { configDotenv } from "dotenv";

configDotenv();

export class Environment {
  static getSetting(name: string): string | null {
    return process.env?.[name] || null;
  }
}
