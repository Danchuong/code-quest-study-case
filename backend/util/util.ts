import request from "request";
import headerObject from "../lib/headerObject";
import toughCookie from "tough-cookie-filestore";
import { timeoutRequestValue } from "./constantValue";
import getCookiePath from "../lib/cookiePath";

const CHA: string = "abcdefghijklmnopqrstuvwxyz0123456789";

type cfScrapTemplateProps = {
  url: string;
  headers: any;
  jar: any;
  timeout: number;
};

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RandString(length: number): string {
  let result: string = "";
  for (let i = 0; i < length; i++)
    result += CHA[getRandomInt(0, CHA.length - 1)];
  return result;
}

export function genFtaa(): string {
  return RandString(18);
}

export function genBfaa(): string {
  return "f1b3f18c715565b589b7823cda7448ce";
}

export function cfScrapTemplate(
  accountIndex: number,
  url: string,
): cfScrapTemplateProps {
  // : cfScrapTemplateProps
  // console.log(cookieList[accountIndex]);
  return {
    url,
    headers: headerObject(),
    jar: request.jar(new toughCookie(getCookiePath(accountIndex))),
    timeout: timeoutRequestValue,
  };
}
