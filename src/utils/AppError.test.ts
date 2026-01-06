import { AppError, handleError } from './AppError';

describe('AppError', () => {
    it('should create an instance with correct properties', () => {
        const error = new AppError('Test error', 400);
        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(400);
        expect(error.isOperational).toBe(true);
    });

    it('should default to 500 status code', () => {
        const error = new AppError('Server error');
        expect(error.statusCode).toBe(500);
    });
});

describe('handleError', () => {
    it('should handle AppError correctly', () => {
        const error = new AppError('Custom error', 404);
        const result = handleError(error);
        expect(result).toEqual({
            message: 'Custom error',
            statusCode: 404,
        });
    });

    it('should handle standard Error correctly', () => {
        const error = new Error('Standard error');
        const result = handleError(error);
        expect(result).toEqual({
            message: 'Standard error',
            statusCode: 500,
        });
    });

    it('should handle unknown error correctly', () => {
        const result = handleError('Unknown string');
        expect(result).toEqual({
            message: 'An unknown error occurred',
            statusCode: 500,
        });
    });
});
