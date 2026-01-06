"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../Error/AppError"));
const handleZodError_1 = __importDefault(require("../Error/handleZodError"));
const handleDuplicateError_1 = __importDefault(require("../Error/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../Error/handleValidationError"));
const handleCastError_1 = __importDefault(require("../Error/handleCastError"));
const logger_1 = __importDefault(require("../utils/logger"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedErrors = (0, handleZodError_1.default)(err);
        statusCode = simplifiedErrors?.statusCode;
        message = simplifiedErrors?.message;
        errorSources = simplifiedErrors?.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode || 500;
        message = err.message || 'Application error';
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    }
    else if (err?.code === 11000) {
        const simplifiedErrors = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedErrors?.statusCode;
        message = simplifiedErrors?.message;
        errorSources = simplifiedErrors?.errorSources;
    }
    else if (err instanceof Error) {
        message = err?.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            }
        ];
    }
    else if (err?.name === 'ValidationError') {
        const simplifiedErrors = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedErrors?.statusCode;
        message = simplifiedErrors?.message;
        errorSources = simplifiedErrors?.errorSources;
    }
    else if (err?.name === 'CastError') {
        const simplifiedErrors = (0, handleCastError_1.default)(err);
        statusCode = simplifiedErrors?.statusCode;
        message = simplifiedErrors?.message;
        errorSources = simplifiedErrors?.errorSources;
    }
    logger_1.default.error(`${req.method} ${req.originalUrl} - ${statusCode}`, {
        message,
        errorSources,
        stack: err.stack,
        userId: req.user?._id,
        ip: req.ip,
    });
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: config_1.default.env === 'development' ? err : undefined,
        stack: config_1.default.env === 'development' ? err.stack : null,
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map