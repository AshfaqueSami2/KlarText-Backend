import { Request, Response, NextFunction } from 'express';

// Middleware to parse JSON fields specifically for grammar form data
export const parseGrammarFormData = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse examples array if it exists and is a string
    if (req.body.examples && typeof req.body.examples === 'string') {
      try {
        req.body.examples = JSON.parse(req.body.examples);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format in examples field'
        });
      }
    }

    // Parse quiz array if it exists and is a string
    if (req.body.quiz && typeof req.body.quiz === 'string') {
      try {
        req.body.quiz = JSON.parse(req.body.quiz);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format in quiz field'
        });
      }
    }

    // Parse isPublished if it's a string
    if (req.body.isPublished && typeof req.body.isPublished === 'string') {
      req.body.isPublished = req.body.isPublished === 'true';
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error parsing form data'
    });
  }
};
