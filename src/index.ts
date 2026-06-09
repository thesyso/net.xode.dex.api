import express, { Request, Response, Router } from 'express';
import JSONbig from 'json-bigint';
import 'dotenv/config'; // 로드와 동시에 설정 적용

import { ApiError } from './pages/errors/apiError';
import { asyncHandler } from './mwares/asyncHandler';
import { mwError } from './mwares/mwError';
import { morganLogger } from './mwares/morganLogger'; // 로그 미들웨어 임포트
import { pageRouter } from './routes';
import { getPools, disconnectPool } from './libs/mongodb.ins.js';

// 환경 변수 읽기 (기본값 설정 권장)
const PORT = process.env.PORT || 4000;

const app = express();

// Express의 기본 res.json 동작을 커스텀 파서로 교체
app.set('json replacer', (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
});



// 1. 서버 시작 시점에 풀 미리 활성화하기
async function startServer() {
    try {
        // 첫 호출 시점에 client.connect()가 실행되어 풀이 초기화됩니다.
        await getPools(); 

        // 라우터 설정 등...
        app.use(morganLogger);
        app.use(express.json());
        // 모든 라우트 등록
        pageRouter(app);

        // 에러 처리 미들웨어 등록 (모든 라우트 뒤에 위치)
        app.use(mwError);

        app.listen(PORT, () => {
          console.log(`[\x1b[33mserver\x1b[0m] is running at "\x1b[36mhttp://localhost:${PORT}\x1b[0m"`);
        });
    } catch (error) {
        console.error("❌ Failed to start server due to DB connection error:", error);
        process.exit(1);
    }
}

startServer();

// 2. 앱 종료 시 안전하게 풀 닫기 (Graceful Shutdown)
const shutdown = async () => {
    console.log("\n👋 Shutting down server...");
    await disconnectPool();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);