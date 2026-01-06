"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("./student.controller");
const auth_1 = require("../../middleWares/auth");
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const student_validation_1 = require("./student.validation");
const router = express_1.default.Router();
router.patch('/update-level', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), (0, validateRequest_1.default)(student_validation_1.StudentValidation.updateLevelValidationSchema), student_controller_1.StudentControllers.updateMyLevel);
router.patch('/:id', student_controller_1.StudentControllers.updateStudent);
exports.StudentRoutes = router;
//# sourceMappingURL=student.routes.js.map