import axios from "axios";
import express from "express";
import login from "../commands/login";
import submit from "../commands/submit";
import { genFtaa, getRandomInt, RandString } from "../util/util";
import data from "../data/submissionData.json";
import { writeFile } from "fs";
import { writeFileSync } from "fs";

const router = express.Router();

// router.use((req, res, next) => {
//   console.log("Hello middleware !!");
// });

router.post("/send-request", (req, res) => {
  // const object = RandString(4);
  // let newArray: Array<any> = data;
  // newArray.push(object);
  // // res.send(process.env.HOME);
  // writeFile(
  //   `${process.env.HOME}/documents/code-quest/backend/data/submissionData.json`,
  //   JSON.stringify(newArray),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: object,
  //     });
  //     console.log(err);
  //   },
  // );
});

router.get("/get-request/:id", (req, res) => {
  // console.log(req.params.id);
  res.send(req.params.id);
  // setInterval(() => {
  // let newArray: Array<any> = [];
  // for (let j = 1; j < data.length; j++) newArray.push(data[j]);
  // console.log(`Request Has Been Full-filled !!!`);
  // res.status(201).json({
  //   message: "Hello from the world",
  // });
  // setInterval(() => {
  //   writeFileSync(
  //     `${process.env.HOME}/documents/code-quest/backend/data/submissionData.json`,
  //     RandString(4),
  //   );
  //   console.log("555");
  // }, 5);
  // res.redirect("/get-request");
  // }, 100);
  // setInterval(() => {
  //   console.log(`HELLO ${RandString(4)}`);
  // }, 500);
  // res.send("Loading car request");
});

for (let i: number = 1; i <= 5; i++) {
  router.get(`/sbot-${i}`, async (req, res) => {
    let sending: Array<string> = [];
    let currentHandle = await login.getLoginStatusAndCsrfToken(i);
    // console.log(currentHandle);
    if (currentHandle.currentUser === "Enter") {
      await login.loggingIn(i, currentHandle.CSRF_token);
      currentHandle = await login.getLoginStatusAndCsrfToken(i);
    }

    const programTypeId = "89",
      problemLink =
        "https://codeforces.com/group/Y9KbsZslTz/contest/515903/problem/A";

    sending.push(
      await submit.submitCode(
        i,
        currentHandle.CSRF_token,
        genFtaa(),
        programTypeId,
        problemLink,
      ),
    );

    res.send(sending);
  });
}

router.get("/bot-manager", async (req, res) => {
  // console.log(req);
  let response: Array<string> = [];
  for (let i: number = 1; i <= 5; i++) {
    const dataI = await axios.get(`http://127.0.0.1:3001/sbot-${i}`);
    response.push(dataI.data[0]);
  }
  res.send(response);
});

router.get("/get-detail", async (req, res) => {
  res.send(
    submit.getDetailFromUrl(
      "https://codeforces.com/group/Y9KbsZslTz/contest/515903/problem/A",
    ),
  );
});

export default router;
