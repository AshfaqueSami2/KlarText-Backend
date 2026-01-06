"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonProgressRoutes = void 0;
const express_1 = __importDefault(require("express"));
const lessonProgress_controller_1 = require("./lessonProgress.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = require("../../middleWares/auth");
const router = express_1.default.Router();
router.post('/complete', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), lessonProgress_controller_1.LessonProgressControllers.markComplete);
router.get('/review/:lessonId', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), lessonProgress_controller_1.LessonProgressControllers.reviewLesson);
router.get('/my-progress', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), lessonProgress_controller_1.LessonProgressControllers.getMyProgress);
router.get('/available-lessons', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), lessonProgress_controller_1.LessonProgressControllers.getAvailableLessons);
exports.LessonProgressRoutes = router;
//# sourceMappingURL=lessonProgress.route.js.map