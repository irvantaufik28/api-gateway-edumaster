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
Object.defineProperty(exports, "__esModule", { value: true });
const handle_upload_1 = require("../middleware/handle-upload");
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield (0, handle_upload_1.uploadCloudinary)(req.file.path, req.body.folder);
        return res.status(200).json({
            type: req.body.type,
            url: url
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    upload
};
//# sourceMappingURL=uploadController.js.map