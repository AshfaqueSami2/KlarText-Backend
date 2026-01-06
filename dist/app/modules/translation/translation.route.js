"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const translation_controller_1 = require("./translation.controller");
const router = express_1.default.Router();
router.post('/word', translation_controller_1.TranslationControllers.translate);
exports.TranslationRoutes = router;
//# sourceMappingURL=translation.route.js.map