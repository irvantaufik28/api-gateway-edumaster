"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiAdapter_1 = __importDefault(require("./apiAdapter"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_error_1 = require("../error/response-error");
dotenv_1.default.config();
const cmsRouter = express_1.default.Router();
const BASE_URI = process.env.CMS_BASE_URI;
const api = (0, apiAdapter_1.default)(BASE_URI || "");
const handleApiRequest = (req, res, next) => {
    const { method, path, body, query } = req;
    const token = req.headers.authorization || "";
    const headers = {
        "Content-Type": "application/json",
        Authorization: token,
    };
    const axiosConfig = {
        method,
        url: path,
        data: body,
        headers,
        params: query,
    };
    api
        .request(axiosConfig)
        .then((resp) => {
        return res.json(resp.data);
    })
        .catch((error) => {
        console.error(`API request failed [${method} ${path}]:`, error.response.data.errors);
        if (error.response && error.response.data && error.response.data.errors) {
            const errorResponse = new response_error_1.ResponseError(error.response.status, error.response.data.errors);
            next(errorResponse);
        }
        else {
            next(error);
        }
    });
};
cmsRouter.get("/class/major-list", handleApiRequest);
cmsRouter.get("/user", handleApiRequest);
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
cmsRouter.get("/classroom-schedule/:id", handleApiRequest);
cmsRouter.post("/classroom-schedule", handleApiRequest);
cmsRouter.post("/classroom-schedule/create-many", handleApiRequest);
cmsRouter.post("/classroom-schedule/structure-curriculum", handleApiRequest);
cmsRouter.post("/classroom-schedule/structure-curriculum-template", handleApiRequest);
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
exports.default = cmsRouter;
//# sourceMappingURL=cmsApi.js.map