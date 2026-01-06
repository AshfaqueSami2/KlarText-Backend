"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStudentId = exports.generateAdminId = void 0;
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
const findLastAdminId = async () => {
    const lastAdmin = await user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.ADMIN }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return lastAdmin?.id ? lastAdmin.id.substring(3) : undefined;
};
const findLastStudentId = async () => {
    const lastStudent = await user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.STUDENT }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return lastStudent?.id ? lastStudent.id.substring(4) : undefined;
};
const generateAdminId = async () => {
    let currentId = (0).toString();
    const lastAdminId = await findLastAdminId();
    if (lastAdminId) {
        currentId = lastAdminId;
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
    return `AD-${incrementId}`;
};
exports.generateAdminId = generateAdminId;
const generateStudentId = async () => {
    let currentId = (0).toString();
    const lastStudentId = await findLastStudentId();
    if (lastStudentId) {
        currentId = lastStudentId;
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(3, '0');
    return `STU-${incrementId}`;
};
exports.generateStudentId = generateStudentId;
//# sourceMappingURL=user.utils.js.map