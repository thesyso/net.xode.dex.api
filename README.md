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
DATABASE_URL=mongodb://localhost:27017/mydb

REDIS_DB_SERVER=3.34.54.25
REDIS_DB_PORT=6379
REDIS_DB_AGENT=10
REDIS_DB_PASSWORD=xode

MARIADB_HOST=3.34.54.25
MARIADB_PORT=3306
MARIADB_ID=admin
MARIADB_PASSWORD=xode