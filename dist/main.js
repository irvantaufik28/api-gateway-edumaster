"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = require("./application/logging");
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error-middleware");
const client_1 = require("@prisma/client");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_winston_1 = __importDefault(require("express-winston"));
const helmet_1 = __importDefault(require("helmet"));
const response_time_1 = __importDefault(require("response-time"));
const api_1 = __importDefault(require("./routes/api"));
const cmsApi_1 = __importDefault(require("./routes/cmsApi"));
const ecommerceApi_1 = __importDefault(require("./routes/ecommerceApi"));
const winston = require("winston");
const prisma = new client_1.PrismaClient();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        console.log("Prisma connected successfully!");
    }
    catch (error) {
        console.error("Prisma connection error:", error);
    }
    finally {
        yield prisma.$disconnect();
    }
}))();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.disable("x-powered-by");
app.use((0, helmet_1.default)());
app.use((0, response_time_1.default)());
app.use(express_winston_1.default.logger({
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
}));
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 100,
}));
app.use("/api/v1", api_1.default);
app.use("/api/v1", cmsApi_1.default);
app.use("/api/v1", ecommerceApi_1.default);
app.use(error_middleware_1.errorMiddleware);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logging_1.logger.info(`App start at ${process.env.HOST}:${process.env.PORT}`);
});
//# sourceMappingURL=main.js.map