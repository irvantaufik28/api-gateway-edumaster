import express from "express";
import apiAdapter from "./apiAdapter";
import dotenv from "dotenv";
import { ResponseError } from "../error/response-error";
import { Request, Response, NextFunction } from "express";
import { AxiosRequestConfig } from "axios";
import jwt from "jsonwebtoken";
import { getToken } from "../auth/helper";
dotenv.config();

const cmsRouter = express.Router();
const BASE_URI = process.env.CMS_BASE_URI;

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
      if (error.response && error.response.data && error.response.data.errors) {
        const errorResponse = new ResponseError(
          error.response.status,
          error.response.data.errors
        );
        next(errorResponse);
      } else {
        next(error);
      }
    });
};

cmsRouter.get("/class/major-list", handleApiRequest);

cmsRouter.get("/user", handleApiRequest);
cmsRouter.get("/user/profil", handleApiRequest);
cmsRouter.get("/user/:id", handleApiRequest);

// classroom route
cmsRouter.get("/classroom", handleApiRequest);
cmsRouter.get("/classroom-list", handleApiRequest);
cmsRouter.get("/classroom/:id", handleApiRequest);
cmsRouter.post("/classroom", handleApiRequest);
cmsRouter.put("/classroom/:id", handleApiRequest);
cmsRouter.delete("/classroom/:id", handleApiRequest);
cmsRouter.post("/classroom/move-student/:id", handleApiRequest);
cmsRouter.delete("/classroom/delete/student", handleApiRequest);

// class major route
cmsRouter.get("/class/major", handleApiRequest);
cmsRouter.get("/class/major/:id", handleApiRequest);
cmsRouter.post("/class/major", handleApiRequest);
cmsRouter.put("/class/major/:id", handleApiRequest);
cmsRouter.delete("/class/major/:id", handleApiRequest);

// role route
cmsRouter.get("/role", handleApiRequest);
cmsRouter.get("/role/:id", handleApiRequest);
cmsRouter.post("/role", handleApiRequest);
cmsRouter.post("/user-role", handleApiRequest);
cmsRouter.delete("/user-role", handleApiRequest);

// permission route
cmsRouter.get("/permission", handleApiRequest);
cmsRouter.post("/permission", handleApiRequest);

// role permission route
cmsRouter.get("/role-permission/:id", handleApiRequest);
cmsRouter.post("/role-permission", handleApiRequest);
cmsRouter.delete("/role-permission/:id", handleApiRequest);

// student route
cmsRouter.get("/student", handleApiRequest);
cmsRouter.get("/student/:id", handleApiRequest);
cmsRouter.post("/student", handleApiRequest);
cmsRouter.put("/student/:id", handleApiRequest);

// student Parent Route
cmsRouter.get("/student-parent", handleApiRequest);
cmsRouter.get("/student-parent/:id", handleApiRequest);
cmsRouter.post("/student-parent", handleApiRequest);
cmsRouter.put("/student-parent/:id", handleApiRequest);
cmsRouter.delete("/student-parent/:id", handleApiRequest);

// staff route
cmsRouter.get("/staff", handleApiRequest);
cmsRouter.get("/staff/teacher", handleApiRequest);
cmsRouter.get("/staff/:id", handleApiRequest);
cmsRouter.post("/staff", handleApiRequest);
cmsRouter.put("/staff/:id", handleApiRequest);

// course route
cmsRouter.get("/course", handleApiRequest);
cmsRouter.get("/course-list", handleApiRequest);
cmsRouter.get("/course/:id", handleApiRequest);
cmsRouter.post("/course", handleApiRequest);
cmsRouter.put("/course/:id", handleApiRequest);
cmsRouter.delete("/course/:id", handleApiRequest);

// teacher course route
cmsRouter.get("/teacher/course", handleApiRequest);
cmsRouter.get("/teacher/course/:id", handleApiRequest);
cmsRouter.get("/teacher/course-staff/:id", handleApiRequest);
cmsRouter.post("/teacher/course", handleApiRequest);
cmsRouter.put("/teacher/course/:id", handleApiRequest);
cmsRouter.delete("/teacher/course/:id", handleApiRequest);

// classroom schedule route
cmsRouter.get("/classroom-schedule", handleApiRequest);
cmsRouter.get("/classroom-schedule/list/teacher/:id", handleApiRequest);
cmsRouter.get("/classroom-schedule/:id", handleApiRequest);
cmsRouter.post("/classroom-schedule", handleApiRequest);
cmsRouter.post("/classroom-schedule/create-many", handleApiRequest);
cmsRouter.post("/classroom-schedule/structure-curriculum", handleApiRequest);
cmsRouter.post(
  "/classroom-schedule/structure-curriculum-template",
  handleApiRequest
);
cmsRouter.put("/classroom-schedule/:id", handleApiRequest);
cmsRouter.delete("/classroom-schedule/:id", handleApiRequest);

// structure curriculum route
cmsRouter.get("/structure-curriculum", handleApiRequest);
cmsRouter.get("/structure-curriculum/list", handleApiRequest);
cmsRouter.get("/structure-curriculum/:id", handleApiRequest);
cmsRouter.post("/structure-curriculum", handleApiRequest);
cmsRouter.put("/structure-curriculum/:id", handleApiRequest);
cmsRouter.delete("/structure-curriculum/:id", handleApiRequest);

cmsRouter.get("/teacher-schedule/:teacher_id", handleApiRequest);
cmsRouter.post("/upload", handleApiRequest);

export default cmsRouter;
