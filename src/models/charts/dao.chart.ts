import { Db } from "mongodb";

const coName = "charts";

const VALID_INTERVALS = ["1m", "5m", "15m", "30m", "60m", "180m", "360m", "1440m"];

const toNumber = (value: any) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const intervalToMinutes = (interval: string) => {
  const parsed = parseInt(interval.replace("m", ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
};

const floorBucketTime = (date: Date, unitMinutes: number) => {
  const unitMs = unitMinutes * 60 * 1000;
  return new Date(Math.floor(date.getTime() / unitMs) * unitMs);
};

// 목록 조회
const etList = async (db: Db, params: any) => {
  const page = params.page ? parseInt(params.page) : 1;
  const pageRow = params.pageRow ? parseInt(params.pageRow) : 500;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePageRow = Number.isFinite(pageRow) && pageRow > 0 ? pageRow : 500;
  const pageBegin = (safePage - 1) * safePageRow;

  let filter: any = {};

  const interval = params.interval && VALID_INTERVALS.includes(params.interval) ? params.interval : "60m";
  const intervalMinutes = intervalToMinutes(interval);

  // 원본은 1분봉만 저장되어 있으므로 항상 1m 데이터를 기준으로 조회합니다.
  filter.interval = "1m";

  // pairKey 필터
  if (params.pairKey) {
    filter.pairKey = params.pairKey;
  }

  filter.chain = params.chain && params.chain.toString().trim().length > 0 ? params.chain : "XODE";

  // bucketTime 날짜 범위 검색 (bucketTime이 string/date 혼합일 수 있어 $expr + $toDate 사용)
  const srBeginDate = params.srBeginDate ? new Date(params.srBeginDate) : null;
  const srEndDate = params.srEndDate ? new Date(params.srEndDate) : null;

  const exprConditions: any[] = [];
  if (srBeginDate && !isNaN(srBeginDate.getTime())) {
    exprConditions.push({ $gte: [{ $toDate: "$bucketTime" }, srBeginDate] });
  }
  if (srEndDate && !isNaN(srEndDate.getTime())) {
    exprConditions.push({ $lte: [{ $toDate: "$bucketTime" }, srEndDate] });
  }
  if (exprConditions.length > 0) {
    filter.$expr = {
      $and: exprConditions,
    };
  }

  if (intervalMinutes === 1) {
    const rows = await db
      .collection(coName)
      .find(filter)
      .sort({ bucketTime: 1 })
      .skip(pageBegin)
      .limit(safePageRow)
      .toArray();

    const count = await db.collection(coName).countDocuments(filter);
    return { rows, count };
  }

  const sourceRows = await db
    .collection(coName)
    .find(filter)
    .sort({ bucketTime: 1 })
    .toArray();

  const grouped = new Map<number, any>();

  for (const row of sourceRows) {
    const sourceTime = row.bucketTime instanceof Date ? row.bucketTime : new Date(row.bucketTime);
    if (isNaN(sourceTime.getTime())) {
      continue;
    }

    const groupTime = floorBucketTime(sourceTime, intervalMinutes);
    const key = groupTime.getTime();

    const open = toNumber(row.open);
    const high = toNumber(row.high);
    const low = toNumber(row.low);
    const close = toNumber(row.close);
    const volumeBase = toNumber(row.volumeBase);
    const volumeQuote = toNumber(row.volumeQuote);
    const tradeCount = toNumber(row.tradeCount);

    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, {
        chain: row.chain,
        interval,
        pairKey: row.pairKey,
        baseAssetId: row.baseAssetId,
        quoteAssetId: row.quoteAssetId,
        bucketTime: groupTime,
        open,
        high,
        low,
        close,
        volumeBase,
        volumeQuote,
        tradeCount,
        isSynthetic: true,
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || new Date(),
      });
      continue;
    }

    existing.high = Math.max(existing.high, high);
    existing.low = Math.min(existing.low, low);
    existing.close = close;
    existing.volumeBase += volumeBase;
    existing.volumeQuote += volumeQuote;
    existing.tradeCount += tradeCount;
    existing.updatedAt = row.updatedAt || existing.updatedAt;
  }

  const aggregatedRows = Array.from(grouped.values())
    .sort((a, b) => a.bucketTime.getTime() - b.bucketTime.getTime())
    .map((row) => ({
      ...row,
      open: row.open.toString(),
      high: row.high.toString(),
      low: row.low.toString(),
      close: row.close.toString(),
      volumeBase: row.volumeBase.toString(),
      volumeQuote: row.volumeQuote.toString(),
    }));

  const count = aggregatedRows.length;
  const rows = aggregatedRows.slice(pageBegin, pageBegin + safePageRow);

  return { rows, count };
};

export default {
  etList,
};
