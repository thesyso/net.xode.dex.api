import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../pages/errors/apiError';

export const mwError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 우리가 정의한 ApiError인 경우
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 예측하지 못한 일반 에러인 경우
  console.error('Unexpected Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};