"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiAdapter_1 = __importDefault(require("./apiAdapter"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_error_1 = require("../error/response-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../auth/helper");
dotenv_1.default.config();
const ecommerceRoutes = express_1.default.Router();
const BASE_URI = process.env.ECOMMERCE_BASE_URI;
const api = (0, apiAdapter_1.default)(BASE_URI || "");
const handleApiRequest = (req, res, next) => {
    const { method, path, body, query } = req;
    const token = req.headers.authorization || "";
    const tokenDecode = jsonwebtoken_1.default.decode((0, helper_1.getToken)(token));
    const user = tokenDecode;
    const headers = {
        "Content-Type": "application/json",
        Authorization: token,
    };
    const axiosConfig = {
        method,
        url: path,
        data: body,
        headers,
        params: Object.assign(Object.assign({}, query), { user: JSON.stringify(user) }),
    };
    api
        .request(axiosConfig)
        .then((resp) => {
        return res.json(resp.data);
    })
        .catch((error) => {
        console.error(`API request failed [${method} ${path}]:`, error.response.data);
        let errorMessage = "An error occurred";
        let statusCode = 500;
        if (error.response && error.response.data) {
            if (Array.isArray(error.response.data.message)) {
                errorMessage = error.response.data.message.join(", ");
            }
            if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            if (error.response.data.statusCode) {
                statusCode = error.response.data.statusCode;
            }
            const errorResponse = new response_error_1.ResponseError(statusCode, errorMessage);
            next(errorResponse);
        }
        else {
            next(error);
        }
    });
};
// PRODUCT
ecommerceRoutes.get("/product", handleApiRequest);
ecommerceRoutes.get("/product/:id", handleApiRequest);
ecommerceRoutes.post("/product", handleApiRequest);
ecommerceRoutes.put("/product/:id", handleApiRequest);
ecommerceRoutes.delete("/product/:id", handleApiRequest);
// PRODUCT IMAGE
ecommerceRoutes.get("/product-image", handleApiRequest);
ecommerceRoutes.get("/product-image/id", handleApiRequest);
ecommerceRoutes.post("/product-image", handleApiRequest);
ecommerceRoutes.delete("/product-image/:id", handleApiRequest);
// CATEGORY
ecommerceRoutes.get("/category", handleApiRequest);
ecommerceRoutes.get("/category/:id", handleApiRequest);
ecommerceRoutes.post("/category", handleApiRequest);
ecommerceRoutes.put("/category/:id", handleApiRequest);
ecommerceRoutes.delete("/category/:id", handleApiRequest);
// CART
ecommerceRoutes.get("/cart", handleApiRequest);
ecommerceRoutes.post("/cart", handleApiRequest);
ecommerceRoutes.delete("/cart/cart-detail/:id", handleApiRequest);
// CART
ecommerceRoutes.get("/order/", handleApiRequest);
ecommerceRoutes.get("/order/:id", handleApiRequest);
ecommerceRoutes.post("/order", handleApiRequest);
ecommerceRoutes.put("/order/:id", handleApiRequest);
exports.default = ecommerceRoutes;
//# sourceMappingURL=ecommerceApi.js.map