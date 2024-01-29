import express from "express";
import apiAdapter from "./apiAdapter";
import dotenv from "dotenv";
import { ResponseError } from "../error/response-error";
import { Request, Response, NextFunction } from "express";
import { AxiosRequestConfig } from "axios";
import jwt from "jsonwebtoken";
import { getToken } from "../auth/helper";
import authorized from "../middleware/jwt"
dotenv.config();

const ecommerceRoutes = express.Router();
const BASE_URI = process.env.ECOMMERCE_BASE_URI;

const api = apiAdapter(BASE_URI || "");

const handleApiRequest = (req: Request, res: Response, next: NextFunction) => {
  const { method, path, body, query } = req;
  const token = req.headers.authorization || "";
  const tokenDecode = jwt.decode(getToken(token));
  const user = tokenDecode;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  const axiosConfig: AxiosRequestConfig = {
    method,
    url: path,
    data: body,
    headers,
    params: { ...query, user: JSON.stringify(user) },
  };

  api
  .request(axiosConfig)
  .then((resp) => {
    return res.json(resp.data);
  })
  .catch((error) => {
    console.error(
      `API request failed [${method} ${path}]:`,
      error.response ? error.response.data : error.message
    );

    let errorMessage = "An error occurred";
    let statusCode = 500;

    if (error.response && error.response.data) {
      if (Array.isArray(error.response.data.message)) {
        errorMessage = error.response.data.message.join(", ");
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      if (error.response.data.statusCode) {
        statusCode = error.response.data.statusCode;
      }
    }

    const errorResponse = new ResponseError(statusCode, errorMessage);
    next(errorResponse);
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

export default ecommerceRoutes;
