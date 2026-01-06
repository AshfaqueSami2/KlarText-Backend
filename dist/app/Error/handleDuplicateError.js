"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const keyValue = err?.keyValue || {};
    const keys = Object.keys(keyValue);
    let errorSources;
    if (keys.length > 0) {
        errorSources = keys.map((key) => {
            const value = keyValue[key];
            return {
                path: key,
                message: `"${value}" already exists`,
            };
        });
    }
    else {
        const match = typeof err?.message === 'string' ? err.message.match(/"([^"]*)"/) : null;
        const extracted = match && match[1];
        errorSources = [
            {
                path: '',
                message: extracted
                    ? `"${extracted}" already exists`
                    : 'Duplicate value already exists',
            },
        ];
    }
    const statusCode = 409;
    return {
        statusCode,
        message: 'Duplicate value',
        errorSources,
    };
};
exports.default = handleDuplicateError;
//# sourceMappingURL=handleDuplicateError.js.map