import { Request, Response } from 'express';
import { VocabServices } from './vocab.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';

const addVocab = async (req: Request, res: Response) => {
  const userId = req.user?.userId as string; // From Auth Middleware
  
  const payload = { ...req.body, user: userId }; // Attach user ID
  
  await VocabServices.addVocabToDB(payload);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Word saved to your vocabulary!',
    data: null,
  });
};

const getMyVocab = async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await VocabServices.getMyVocabFromDB(userId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Vocabulary fetched successfully',
    data: result,
  });
};

export const VocabControllers = { addVocab, getMyVocab };