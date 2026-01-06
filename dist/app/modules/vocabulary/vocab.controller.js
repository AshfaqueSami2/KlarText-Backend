"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabControllers = void 0;
const vocab_service_1 = require("./vocab.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const addVocab = async (req, res) => {
    const userId = req.user?.userId;
    const payload = { ...req.body, user: userId };
    await vocab_service_1.VocabServices.addVocabToDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Word saved to your vocabulary!',
        data: null,
    });
};
const getMyVocab = async (req, res) => {
    const userId = req.user?.userId;
    const result = await vocab_service_1.VocabServices.getMyVocabFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Vocabulary fetched successfully',
        data: result,
    });
};
exports.VocabControllers = { addVocab, getMyVocab };
//# sourceMappingURL=vocab.controller.js.map