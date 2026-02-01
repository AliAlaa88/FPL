import serverless from "serverless-http";
// export { handler } from "../../server.js";
import app from "../../server.js";

export const handler = serverless(app);