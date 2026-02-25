import { Request, Response } from 'express';

import { asyncHandler } from '../../middleware/asyncHandler';
import { ApiError } from '../../pages/errors/apiError';

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id === 'admin') {
    throw new ApiError(403, '관리자 정보에는 접근할 수 없습니다.');
  }

  res.status(200).json({
    success: true,
    data: { id, name: 'Gemini', role: 'AI' }
  });
});