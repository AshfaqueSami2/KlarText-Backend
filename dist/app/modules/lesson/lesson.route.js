"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const lesson_controller_1 = require("./lesson.controller");
const lesson_validation_1 = require("./lesson.validation");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const auth_1 = require("../../middleWares/auth");
const user_constant_1 = require("../user/user.constant");
const cloudinary_1 = require("../../utils/cloudinary");
const parseFormData_1 = require("../../middleWares/parseFormData");
const router = express_1.default.Router();
router.post('/create-lesson', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), cloudinary_1.uploadProfileImage.single('coverImage'), parseFormData_1.parseFormData, (0, validateRequest_1.default)(lesson_validation_1.LessonValidation.createLessonValidationSchema), lesson_controller_1.LessonControllers.createLesson);
router.get('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), lesson_controller_1.LessonControllers.getAllLessons);
router.get('/:lessonId', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), lesson_controller_1.LessonControllers.getLessonById);
router.post('/:lessonId/regenerate-audio', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), lesson_controller_1.LessonControllers.regenerateAudio);
router.put('/:lessonId', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), cloudinary_1.uploadProfileImage.single('coverImage'), parseFormData_1.parseFormData, (0, validateRequest_1.default)(lesson_validation_1.LessonValidation.updateLessonValidationSchema), lesson_controller_1.LessonControllers.updateLesson);
router.delete('/:lessonId', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), lesson_controller_1.LessonControllers.deleteLesson);
exports.LessonRoutes = router;
//# sourceMappingURL=lesson.route.js.map