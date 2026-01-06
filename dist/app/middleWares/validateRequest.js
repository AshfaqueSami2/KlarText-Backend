"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const validateRequest = (schema) => {
    return (0, catchAsync_1.default)(async (req, _res, next) => {
        const validationData = {
            body: req.body,
            cookies: req.cookies,
        };
        if (Object.keys(req.params).length > 0) {
            validationData.params = req.params;
        }
        if (Object.keys(req.query).length > 0) {
            validationData.query = req.query;
        }
        await schema.parseAsync(validationData);
        next();
    });
};
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map