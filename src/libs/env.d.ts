declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
    }
  }
}

// global.d.ts 또는 app.ts 최상단
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// 실제 구현체 등록
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// BigInt.prototype.toJSON = function () {
//   return Number(this); // 주의: 매우 큰 숫자는 정밀도가 깨질 수 있음
// };

export {};