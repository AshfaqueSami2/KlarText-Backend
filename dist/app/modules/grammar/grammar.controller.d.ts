import { Request, Response } from 'express';
export declare const GrammarControllers: {
    createTopic: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllTopics: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTopicById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateTopic: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteTopic: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createLesson: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLessonsByTopic: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLessonById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateLesson: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteLesson: (req: Request, res: Response, next: import("express").NextFunction) => void;
    completeLessonProgress: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createExerciseSet: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getExerciseSetsByLesson: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getExerciseSetById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateExerciseSet: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteExerciseSet: (req: Request, res: Response, next: import("express").NextFunction) => void;
    submitExerciseAnswers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserProgress: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getRecommendedLesson: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=grammar.controller.d.ts.map