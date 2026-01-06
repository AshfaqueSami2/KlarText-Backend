import { Response } from 'express';
type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
    meta?: TMeta;
    audioUrl?: string;
    mimeType?: string;
};
declare const sendResponse: <T>(res: Response, data: TResponse<T>) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map