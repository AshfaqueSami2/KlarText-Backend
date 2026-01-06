"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const notFound = (req, res, next) => {
    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'API route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`,
    });
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map