// import { Request, Response } from 'express';
// import { StudentServices } from './student.service';
// import sendResponse from '../../utils/sendResponse';
// import { HttpStatus } from 'http-status-ts';

// const updateStudent = async (req: Request, res: Response) => {
 
//     const { id } = req.params; // This is the Student ID (not User ID)
//     const result = await StudentServices.updateStudentIntoDB(id, req.body);

//    sendResponse(res,{
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Student updated successfully',
//     data: result,
//    })
// };

// export const StudentControllers = {
//   updateStudent,
// };




import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

// Existing method (By ID)
const updateStudent = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await StudentServices.updateStudentIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
};
const updateMyLevel = async (req: Request, res: Response) => {
  const userId = req.user?.userId as string; 
  // ✅ Fix: Match the Zod schema field name ('currentLevel')
  const { currentLevel } = req.body; 

  const student = await StudentServices.getStudentByUserId(userId);
  if (!student) throw new Error("Student profile not found");

  // Update
  const result = await StudentServices.updateStudentIntoDB(student._id.toString(), { 
    currentLevel 
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Level updated successfully',
    data: result,
  });
};

export const StudentControllers = {
  updateStudent,
  updateMyLevel
};