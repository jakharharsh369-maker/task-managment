import app from "../server.js";
import serverless from "serverless-http";

export const config = {
  runtime: "nodejs",
};

export default serverless(app);
