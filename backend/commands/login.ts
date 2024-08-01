import request from "request";
import headerObject from "../lib/headerObject";
import toughCookie from "tough-cookie-filestore";
import accountList from "../data/listAccount.json";
import { cfScrapTemplate, genBfaa, genFtaa } from "../util/util";
import { timeoutRequestValue } from "../util/constantValue";
import { load } from "cheerio";
import getCookiePath from "../lib/cookiePath";

export type loginStatusAndCsrfToken = {
  currentUser: string;
  CSRF_token: string;
};

const login = {
  getLoginStatusAndCsrfToken(
    accountIndex: number,
  ): Promise<loginStatusAndCsrfToken> {
    return new Promise<loginStatusAndCsrfToken>((resolve, reject) => {
      const requestDetails = cfScrapTemplate(
        accountIndex,
        "https://codeforces.com/enter",
      );

      request.get(requestDetails, (error, response, body) => {
        if (error) return reject(error);

        const $ = load(body);
        const currentUser = $(".lang-chooser a").eq(2).text();
        const CSRF_token = $("input").attr("value");
        if (CSRF_token === undefined)
          return reject(new Error("CSRF token retrieval failed !!!"));
        if (CSRF_token.length < 20)
          return reject(new Error("Invalid CSRF Token !"));
        resolve({ currentUser, CSRF_token });
      });
    });
  },
  getCSRFToken(accountIndex: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const requestDetails = cfScrapTemplate(
        accountIndex,
        "https://codeforces.com/enter",
      );

      request.get(requestDetails, (error, response, body) => {
        if (error) return reject(error);
        const $ = load(body);
        const CSRF_token = $("input").attr("value");
        if (CSRF_token === undefined)
          return reject(new Error("CSRF token retrieval failed !!!"));
        if (CSRF_token.length < 20)
          return reject(new Error("Invalid CSRF Token !"));
        resolve(CSRF_token);
      });
    });
  },
  loggingIn(accountIndex: number, CSRF_token: string) {
    return new Promise((resolve, reject) => {
      const userDetail = accountList[accountIndex];

      const headerDetails = {
        origin: "https://codeforces.com",
        referer: "https://codeforces.com/enter?back=%2F",
      };

      const headers = headerObject(headerDetails);
      const jar = request.jar(new toughCookie(getCookiePath(accountIndex)));

      const handle: string = userDetail.username;
      const password: string = userDetail.password;
      const ftaa: string = genFtaa();
      const bfaa: string = genBfaa();

      // console.log(bfaa, ftaa);

      const form = {
        handleOrEmail: handle,
        password,
        csrf_token: CSRF_token,
        action: "enter",
        remember: "on",
        _tta: "176",
        ftaa,
        bfaa,
      };

      const requestDetails = {
        url: "https://codeforces.com/enter",
        headers,
        jar,
        form,
        timeout: timeoutRequestValue,
      };

      request.post(requestDetails, (error, response, body) => {
        if (error) return reject(error);
        if (response.statusCode !== 302)
          return reject("Failed to login... Check your handle or password !");
        resolve(1);
      });
    });
  },
};

export default login;
