"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormData = void 0;
const parseFormData = (req, res, next) => {
    if (req.body && req.body.data) {
        try {
            const parsedData = JSON.parse(req.body.data);
            const { data, ...otherFields } = req.body;
            req.body = { ...parsedData, ...otherFields };
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON data in form field'
            });
        }
    }
    next();
};
exports.parseFormData = parseFormData;
//# sourceMappingURL=parseFormData.js.map