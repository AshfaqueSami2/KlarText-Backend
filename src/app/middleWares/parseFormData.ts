import { Request, Response, NextFunction } from 'express';

// Middleware to parse JSON data from form-data when file uploads are involved
export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  // If there's a 'data' field in the form, parse it as JSON and merge with body
  if (req.body && req.body.data) {
    try {
      const parsedData = JSON.parse(req.body.data);
      // Merge the parsed data with the existing body (excluding the 'data' field)
      const { data, ...otherFields } = req.body;
      req.body = { ...parsedData, ...otherFields };
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON data in form field'
      });
    }
  }
  next();
};