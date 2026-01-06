"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const vocab_controller_1 = require("./vocab.controller");
const vocab_validation_1 = require("./vocab.validation");
const auth_1 = require("../../middleWares/auth");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const router = express_1.default.Router();
router.post('/add', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), (0, validateRequest_1.default)(vocab_validation_1.VocabValidation.addVocabSchema), vocab_controller_1.VocabControllers.addVocab);
router.get('/my-list', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), vocab_controller_1.VocabControllers.getMyVocab);
exports.VocabRoutes = router;
//# sourceMappingURL=vocab.route.js.map