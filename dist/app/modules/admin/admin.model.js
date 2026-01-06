"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileImage: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    needsPasswordChange: { type: Boolean, default: true },
}, { timestamps: true });
exports.Admin = (0, mongoose_1.model)('Admin', adminSchema);
//# sourceMappingURL=admin.model.js.map