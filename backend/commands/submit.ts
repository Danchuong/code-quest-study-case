import request from "request";
import headerObject from "../lib/headerObject";
import toughCookie from "tough-cookie-filestore";
import getCookiePath from "../lib/cookiePath";
import { cfScrapTemplate, genBfaa, genFtaa } from "../util/util";
import { load } from "cheerio";
import { timeoutRequestValue } from "../util/constantValue";

type problemDetailProps = {
  mainCf: "https://codeforces.com";
  problemIndex: string;
  problemLink: string;
  submitProblemLink: string;
};

const submit = {
  submitTemplate() {
    return {
      ftaa: genFtaa(),
      bfaa: genBfaa(),
      action: "submitSolutionFormSubmitted",
      tabSize: "4",
      _tta: "594",
      sourceCodeConfirmed: "true",
    };
  },
  getDetailFromUrl(problemLink: string): problemDetailProps {
    let numberOfSlash: number = 0,
      slashPos: Array<number> = [];
    for (let i = problemLink.length - 1; i >= 0; i--) {
      if (problemLink[i] === "/") {
        numberOfSlash++;
        slashPos.push(i);
      }
      if (numberOfSlash === 2) break;
    }

    let submitProblemLink: string = "";
    for (let i = 0; i < slashPos[1]; i++) submitProblemLink += problemLink[i];
    submitProblemLink += "/submit";
    let problemIndex: string = "";
    for (let i = slashPos[0] + 1; i < problemLink.length; i++)
      problemIndex += problemLink[i];

    return {
      mainCf: "https://codeforces.com",
      problemLink,
      problemIndex,
      submitProblemLink,
    };
  },
  submitCode(
    accountIndex: number,
    csrf_token: string,
    source: string,
    programTypeId: string,
    problemLink: string,
  ): Promise<string> {
    let problemDetail = this.getDetailFromUrl(problemLink);
    return new Promise<string>(async (resolve, reject) => {
      const formData = {
        csrf_token,
        programTypeId,
        source,
        submittedProblemIndex: problemDetail.problemIndex,
        ...this.submitTemplate(),
      };

      const headerDetails = {
        origin: problemDetail.mainCf,
        referer: problemDetail.submitProblemLink,
      };

      const headers = headerObject(headerDetails);

      const requestObject = {
        url: problemDetail.submitProblemLink,
        jar: request.jar(new toughCookie(getCookiePath(accountIndex))),
        timeout: timeoutRequestValue,
        headers,
        formData,
      };

      request.post(requestObject, (error, response, body) => {
        if (error) return reject(error);

        console.log("submitted successfully");
      });

      setTimeout(
        () =>
          request.get(
            cfScrapTemplate(accountIndex, problemDetail.problemLink),
            async (e, r, b) => {
              const submissionId: string = load(b)(".rtable.smaller")
                .children("tbody")
                .children("tr")
                .eq(1)
                .children("td")
                .first()
                .text();
              resolve(submissionId);
            },
          ),
        1500,
      );
    });
  },
};

export default submit;
