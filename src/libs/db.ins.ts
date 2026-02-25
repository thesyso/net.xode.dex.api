import * as mariadb from 'mariadb';
import 'dotenv/config'; // For loading environment variables
// const moment = require('moment');
import { moMessage } from './modules/message.js';

// moment.tz.setDefault("Asia/Seoul");

//require('dotenv').config();
const connConfig: mariadb.PoolConfig = {
    host: process.env.MARIADB_HOST || 'localhost',
    port: process.env.MARIADB_PORT ? parseInt(process.env.MARIADB_PORT) : 3306,
    user: process.env.MARIADB_ID || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: 'dex_db',
    connectionLimit: 10,
    connectTimeout: 10000
} 

// pool 을 선택
const pool = mariadb.createPool(connConfig);

let connCount = 0;

async function getPools(){
    // async ..
    let conn = await pool.getConnection();
    if(connCount >= 10){
        connCount = connCount % 10;
    }

    if(connCount == 0){
        moMessage(
            `db connection`,
            `pools >> sum : ${pool.totalConnections()} , active : ${pool.totalConnections()} , idle : ${pool.totalConnections()}`,
            'info'
        );
    }

    connCount = connCount + 1;
    return conn;
}

export default getPools;
