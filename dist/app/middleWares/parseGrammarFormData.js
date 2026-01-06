"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGrammarFormData = void 0;
const parseGrammarFormData = (req, res, next) => {
    try {
        if (req.body.examples && typeof req.body.examples === 'string') {
            try {
                req.body.examples = JSON.parse(req.body.examples);
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON format in examples field'
                });
            }
        }
        if (req.body.quiz && typeof req.body.quiz === 'string') {
            try {
                req.body.quiz = JSON.parse(req.body.quiz);
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON format in quiz field'
                });
            }
        }
        if (req.body.isPublished && typeof req.body.isPublished === 'string') {
            req.body.isPublished = req.body.isPublished === 'true';
        }
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error parsing form data'
        });
    }
};
exports.parseGrammarFormData = parseGrammarFormData;
//# sourceMappingURL=parseGrammarFormData.js.map