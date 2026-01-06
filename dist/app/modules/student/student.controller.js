"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentControllers = void 0;
const student_service_1 = require("./student.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const result = await student_service_1.StudentServices.updateStudentIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Student updated successfully',
        data: result,
    });
};
const updateMyLevel = async (req, res) => {
    const userId = req.user?.userId;
    const { currentLevel } = req.body;
    const student = await student_service_1.StudentServices.getStudentByUserId(userId);
    if (!student)
        throw new Error("Student profile not found");
    const result = await student_service_1.StudentServices.updateStudentIntoDB(student._id.toString(), {
        currentLevel
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Level updated successfully',
        data: result,
    });
};
exports.StudentControllers = {
    updateStudent,
    updateMyLevel
};
//# sourceMappingURL=student.controller.js.map