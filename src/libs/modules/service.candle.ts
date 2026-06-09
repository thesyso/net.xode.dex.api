import { MongoClient, Collection, Document } from 'mongodb';
import { startOfMinute } from 'date-fns';

// 1. TypeScript 인터페이스 정의
export interface SwapCandle1m {
  pairAddress: string;
  timestamp: Date; // '분' 단위로 정규화된 시간 (초, 밀리초는 00.000)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class CandleService {
  private candleCollection: Collection<SwapCandle1m>;

  constructor(client: MongoClient, dbName: string) {
    const db = client.db(dbName);
    this.candleCollection = db.collection<SwapCandle1m>('swap_candles_1m');
  }

  /**
   * 1. 초기 인덱스 설정 (서비스 시작 시 필수 호출)
   */
  async initIndexes(): Promise<void> {
    await this.candleCollection.createIndex(
      { pairAddress: 1, timestamp: -1 },
      { name: 'idx_pair_timestamp' }
    );
    console.log('✅ MongoDB Candle Indexes Initialized.');
  }

  /**
   * 2. 스왑 거래 발생 시 1분봉 업데이트 (Upsert)
   * @param pairAddress 토큰 페어 주소
   * @param price 현재 스왑 교환 가격
   * @param amount 거래된 토큰 수량
   * @param txTime 트랜잭션 발생 시간 (기본값 현재시간)
   */
  async recordSwapEvent(
    pairAddress: string,
    price: number,
    amount: number,
    txTime: Date = new Date()
  ): Promise<void> {
    // date-fns를 사용해 초와 밀리초를 0으로 맞춤 (예: 14:05:23 -> 14:05:00)
    const normalizedMinute = startOfMinute(txTime);

    await this.candleCollection.updateOne(
      {
        pairAddress: pairAddress,
        timestamp: normalizedMinute,
      },
      {
        // 1. 문서가 처음 생성(Upsert)될 때만 open 값을 설정
        $setOnInsert: { open: price },
        // 2. 종가와 거래량은 항상 업데이트
        $set: { close: price },
        $inc: { volume: amount },
        // 3. 최고가/최저가 비교 후 자동으로 큰값/작은값으로 갱신
        $max: { high: price },
        $min: { low: price },
      },
      { upsert: true } // 데이터가 없으면 새로 생성
    );
  }

  /**
   * 3. 원하는 분단위(binSize)로 롤업하여 차트 데이터 조회 (Aggregation)
   * @param pairAddress 토큰 페어 주소
   * @param binSize 분 단위 (1, 3, 5, 15, 30, 60, 180 등)
   * @param from 시작 시간
   * @param to 종료 시간
   */
  async getChartData(
    pairAddress: string,
    binSize: number,
    from: Date,
    to: Date
  ): Promise<Document[]> {
    
    // 일봉(Day) 처리를 위한 조건 분기
    const unit = binSize >= 1440 ? 'day' : 'minute';
    const finalBinSize = binSize >= 1440 ? Math.floor(binSize / 1440) : binSize;

    const pipeline = [
      // [Stage 1] 조건에 맞는 1분봉 원본 필터링
      {
        $match: {
          pairAddress: pairAddress,
          timestamp: { $gte: from, $lte: to },
        },
      },
      // [Stage 2] 시간 절삭 및 그룹화 연산
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$timestamp',
              unit: unit,
              binSize: finalBinSize,
            },
          },
          open: { $first: '$open' },   // 그룹 내 가장 첫 번째 1분봉의 시가
          high: { $max: '$high' },     // 그룹 내 가장 높은 고가
          low: { $min: '$low' },       // 그룹 내 가장 낮은 저가
          close: { $last: '$close' },   // 그룹 내 가장 마지막 1분봉의 종가
          volume: { $sum: '$volume' }, // 그룹 내 모든 거래량 합산
        },
      },
      // [Stage 3] 시간 순 정렬
      {
        $sort: { _id: 1 },
      },
      // [Stage 4] 프론트엔드가 쓰기 좋게 필드명 정제 (선택사항)
      {
        $project: {
          _id: 0,
          timestamp: '$_id',
          open: 1,
          high: 1,
          low: 1,
          close: 1,
          volume: 1,
        },
      },
    ];

    return await this.candleCollection.aggregate(pipeline).toArray();
  }
}