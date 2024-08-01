import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/router";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/", router);

const port = 3001;

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is currently running on port: ${port}`);
});
