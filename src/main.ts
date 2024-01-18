import express from "express";
import { logger } from "./application/logging";
import cors from "cors";
import { errorMiddleware } from "./middleware/error-middleware";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import expressWinston from "express-winston";
import helmet from "helmet";
import responseTime from "response-time";

import router from "./routes/api";
import cmsRouter from "./routes/cmsApi";
const winston = require("winston");

const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully!");
  } catch (error) {
    console.error("Prisma connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
})();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.disable("x-powered-by");

app.use(helmet());

app.use(responseTime());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    level: "debug",
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);

app.use(cors());

app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/v1", router);
app.use("/api/v1", cmsRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`App start at ${process.env.HOST}:${process.env.PORT}`);
});
