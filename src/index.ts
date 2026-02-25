import express, { Request, Response, Router } from 'express';
import 'dotenv/config'; // 로드와 동시에 설정 적용

import { ApiError } from './pages/errors/apiError';
import { asyncHandler } from './middleware/asyncHandler';
import { middlewareError } from './middleware/middlewareError';
import { morganLogger } from './middleware/morganLogger'; // 로그 미들웨어 임포트
import { pageRouter } from './routes';

// 환경 변수 읽기 (기본값 설정 권장)
const PORT = process.env.PORT || 4000;

const app = express();

app.use(morganLogger);
app.use(express.json());

// 라우터 연결 (버전 관리를 위해 /api/v1 권장)
// app.use('/api/users', routes);

// 비동기 라우트 예시
// app.get('/user/:id', asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
  
//   // 예시: 유저가 없을 때 404 에러 던지기
//   if (id === 'admin') {
//     throw new ApiError(403, '접근 권한이 없습니다.');
//   }

//   res.send({ id, name: 'John Doe' });
// }));

// app.get('/', (req: Request, res: Response) => {
//   res.send(`Server is running in ${process.env.NODE_ENV} mode`);
// });
// 404 처리 (라우터에 없는 경로)
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ success: false, message: '경로를 찾을 수 없습니다.' });
// });

// 모든 라우트 등록
pageRouter(app);
// 에러 처리 미들웨어 등록 (모든 라우트 뒤에 위치)
app.use(middlewareError);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

