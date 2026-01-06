"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const response = {
        success: data.success,
        message: data.message,
    };
    if (data.audioUrl) {
        response.audioUrl = data.audioUrl;
    }
    if (data.mimeType) {
        response.mimeType = data.mimeType;
    }
    response.data = data.data;
    if (data.meta) {
        response.meta = data.meta;
    }
    res.status(data.statusCode).json(response);
};
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map