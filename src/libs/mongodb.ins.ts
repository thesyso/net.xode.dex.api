import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';
import { moMessage } from './modules/message.js';

const uri = `mongodb://${process.env.MONGODB_ID}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
const nameDB = process.env.MONGODB_DBNAME || 'dex_db';

// MariaDB의 createPool과 유사하게 client 인스턴스를 미리 생성 (연결은 아직 안 됨)
const client = new MongoClient(uri, {
    maxPoolSize: 10,      // MariaDB의 connectionLimit과 대응
    minPoolSize: 5,
    connectTimeoutMS: 10000 // MariaDB의 connectTimeout과 대응
});

let connCount = 0;
let dbInstance: Db | null = null;
let connectPromise: Promise<Db> | null = null;

/**
 * MongoDB 연결 및 DB 인스턴스를 반환하는 함수
 */
export async function getPools(): Promise<Db> {
    // 1. 초기 연결 수행 (이미 연결되어 있다면 통과)
    if (!dbInstance) {
        connectPromise ??= client.connect()
            .then(() => {
                dbInstance = client.db(nameDB);
                return dbInstance;
            })
            .catch((error) => {
                moMessage(
                    `mongodb connection`,
                    error instanceof Error ? error.message : String(error),
                    'error'
                );
                throw error;
            })
            .finally(() => {
                connectPromise = null;
            });

        await connectPromise;
    }

    if (!dbInstance) {
        throw new Error('MongoDB database instance is not available.');
    }

    // 2. 로그 기록 (제공해주신 MariaDB 로직 이식)
    if (connCount >= 10) {
        connCount = connCount % 10;
    }

    if (connCount === 0) {
        // MongoDB는 정확히 active/idle을 속성으로 노출하지 않으므로 상태 메시지로 대체
        moMessage(
            `mongodb connection`,
            `status >> connected to ${nameDB} at ${uri}`,
            'info'
        );
    }

    connCount = connCount + 1;

    // MongoDB는 별도의 release() 과정 없이 db 객체를 계속 재사용합니다.
    return dbInstance;
}

/**
 * 연결을 종료하는 함수 (앱 종료 시 사용)
 */
export async function disconnectPool(): Promise<void> {
    if (dbInstance || connectPromise) {
        await client.close();
        dbInstance = null;
        connectPromise = null;
        console.log("💤 MongoDB Pool closed.");
    }
}
