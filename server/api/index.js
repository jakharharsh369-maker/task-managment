import app from "../server.js";
import serverless from "serverless-http";

export const config = {
  runtime: "nodejs20.x",
};

export default serverless(app);
