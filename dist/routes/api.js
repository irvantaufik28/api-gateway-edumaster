"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../auth/authController"));
const handle_upload_1 = require("../middleware/handle-upload");
const uploadController_1 = __importDefault(require("../upload/uploadController"));
const router = express_1.default.Router();
router.post('/login', authController_1.default.login);
router.post('/upload', handle_upload_1.upload.single('file'), uploadController_1.default.upload);
exports.default = router;
//# sourceMappingURL=api.js.map