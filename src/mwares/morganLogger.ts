import morgan from 'morgan';
import 'dotenv/config';

// 환경 변수에 따라 로그 포맷 결정 (기본값: dev)
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

// morgan 미들웨어를 내보냅니다.
export const morganLogger = morgan(format);