import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import * as pinoHttpModule from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { connectMongoDB } from "./lib/mongodb";

const pinoHttp = (pinoHttpModule.default ?? pinoHttpModule) as (opts: object) => (req: Request, res: Response, next: NextFunction) => void;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Record<string, unknown>) {
        return {
          id: req["id"],
          method: req["method"],
          url: typeof req["url"] === "string" ? req["url"].split("?")[0] : req["url"],
        };
      },
      res(res: Record<string, unknown>) {
        return {
          statusCode: res["statusCode"],
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

connectMongoDB().catch((err) => {
  logger.warn({ err }, "MongoDB not available — package CRUD disabled, location search still works");
});

export default app;
