import path from "path";

const config_directory = path.join(
  typeof process.env.HOME === "string" ? process.env.HOME : "",
  "documents/code-quest/backend/data/cookieList",
);

export default function getCookiePath(accountIndex: number) {
  return path.join(config_directory, `botCookie-0${accountIndex}.json`);
}
