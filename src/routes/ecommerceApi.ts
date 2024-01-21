import express from "express";
import apiAdapter from "./apiAdapter";
import dotenv from "dotenv";
import { ResponseError } from "../error/response-error";
import { Request, Response, NextFunction } from "express";
import { AxiosRequestConfig } from "axios";

dotenv.config();

const ecommerceRoutes = express.Router();
const BASE_URI = process.env.ECOMMERCE_BASE_URI;

const api = apiAdapter(BASE_URI || "");

const handleApiRequest = (req: Request, res: Response, next: NextFunction) => {
    const { method, path, body, query } = req;
  const token = req.headers.authorization || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  const axiosConfig: AxiosRequestConfig = {
    method,
    url: path,
    data: body,
    headers,
    params: query
  };

  api
    .request(axiosConfig)
    .then((resp) => {
      return res.json(resp.data);
    })
    .catch((error) => {
      console.error(
        `API request failed [${method} ${path}]:`,
        error.response.data
      );

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

        const errorResponse = new ResponseError(statusCode, errorMessage);
        next(errorResponse);
      } else {
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

export default ecommerceRoutes;
