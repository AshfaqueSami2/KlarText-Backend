"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['monthly', 'yearly', 'lifetime'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed', 'cancelled'], default: 'pending' },
    valId: { type: String },
    cardType: { type: String },
    paymentMethod: { type: String },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
//# sourceMappingURL=transaction.model.js.map