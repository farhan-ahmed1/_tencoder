import { disconnectDatabase } from "../database";

export default async () => {
  await disconnectDatabase();
};
