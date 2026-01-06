import { Request, Response } from 'express';
import { TranslationServices } from './translation.service';
import sendResponse from '../../utils/sendResponse';

const translate = async (req: Request, res: Response) => {
  
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ success: false, message: "Text is required" });
    }

    const translation = await TranslationServices.translateText(text);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Translation successful',
        data: {
            translation,
        },
    });
  } 


export const TranslationControllers = {
  translate,
};