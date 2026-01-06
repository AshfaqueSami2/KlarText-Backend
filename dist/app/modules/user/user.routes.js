"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const auth_1 = require("../../middleWares/auth");
const user_constant_1 = require("./user.constant");
const cloudinary_1 = require("../../utils/cloudinary");
const parseFormData_1 = require("../../middleWares/parseFormData");
const router = express_1.default.Router();
router.post('/create-student', (0, auth_1.conditionalAuth)(), cloudinary_1.uploadProfileImage.single('profileImage'), parseFormData_1.parseFormData, (0, validateRequest_1.default)(user_validation_1.createUserValidationSchema), user_controller_1.UserControllers.createUser);
router.post('/create-admin', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), cloudinary_1.uploadProfileImage.single('profileImage'), parseFormData_1.parseFormData, (0, validateRequest_1.default)(user_validation_1.createUserValidationSchema), user_controller_1.UserControllers.createAdmin);
router.get('/me', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.STUDENT), user_controller_1.UserControllers.getMe);
router.put('/update-profile', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.STUDENT), cloudinary_1.uploadProfileImage.single('profileImage'), parseFormData_1.parseFormData, user_controller_1.UserControllers.updateProfile);
exports.UserRoutes = router;
//# sourceMappingURL=user.routes.js.map