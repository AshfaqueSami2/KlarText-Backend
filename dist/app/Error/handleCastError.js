"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const statusCode = 400;
    const errorSources = [{
            path: err.path,
            message: err.message,
        }];
    return {
        statusCode,
        message: 'Cast Error',
        errorSources,
    };
};
exports.default = handleCastError;
//# sourceMappingURL=handleCastError.js.map