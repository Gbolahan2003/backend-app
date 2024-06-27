import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
    status: string;
    error: string;
}

export const errorHandler = (err: any, req: Request, res: Response, next?: NextFunction) => {
    console.error('Error caught by error handler:', err);

    let statusCode
    let errorResponse: ErrorResponse = { status: '500', error: 'Internal Server Error' };

    if (err.status) {
        statusCode = err.status;
        errorResponse = { status: String(err.status), error: err.message || 'Unknown Error' };
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        errorResponse = { status: '400', error: err.message || 'Validation Error' };
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        errorResponse = { status: '400', error: 'Invalid ID' };
    }

    res.status(statusCode || 500).json(errorResponse);
};
