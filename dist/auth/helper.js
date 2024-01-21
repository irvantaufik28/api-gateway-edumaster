"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateAccessToken = (data) => {
    const user_data = {
        id: data.id,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
        user_detail: data.user_detail,
    };
    const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
    const accessToken = jsonwebtoken_1.default.sign(user_data, secretKey, { expiresIn: "6h" });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=helper.js.map