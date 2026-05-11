# net.xode.dex.api


src/
├── controllers/    # 비즈니스 로직 (함수)
├── routes/         # 엔드포인트 정의 (URL)
├── libs/           # interface, type 등
├── middleware/     # 에러 핸들러 등등
└── index.ts        # 서버 실행 및 미들웨어 연결

### env config
PORT=3000
NODE_ENV=development

REDIS_DB_SERVER=127.0.0.1
REDIS_DB_PORT=6379
REDIS_DB_AGENT=10
REDIS_DB_PASSWORD=xode

MARIADB_HOST=127.0.0.1
MARIADB_PORT=3306
MARIADB_ID=admin
MARIADB_PASSWORD=xode