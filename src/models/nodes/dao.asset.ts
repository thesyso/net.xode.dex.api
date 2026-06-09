import { Db, ObjectId } from "mongodb";
import { IDXAssets } from "./dto.node";

const coName = "assets";

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// 목록 조회
const etList = async (db: Db, params: any) => {
  const pageRow = parsePositiveInt(params.pageRow, 10);
  const page = parsePositiveInt(params.page, 1);
  const pageBegin = (page - 1) * pageRow;

  // 1. Filter(Where 조건) 생성
  let filter: any = {};

  // 사용 여부 (is_use)
  // if (params.srUsed) {
  //   filter.is_use = parseInt(params.srUsed);
  // } else {
  //   filter.menu_code = { $ne: null };
  // }

  // 검색어 (LIKE 처리)
  if (params.sr != 0 && params.srTxt?.length > 0) {
    const regex = new RegExp(params.srTxt, "i"); // case-insensitive LIKE %txt%
    if (params.sr == 1) filter.assetNode = regex;
    else if (params.sr == 2) filter.name = regex;
  }

  // 날짜 검색
  const srBeginDate = new Date(params.srBeginDate);
  const srEndDate = new Date(params.srEndDate);

  if (!isNaN(srBeginDate.getTime()) || !isNaN(srEndDate.getTime())) {
    filter.updatedAt = {};
    if (!isNaN(srBeginDate.getTime())) {
      filter.updatedAt.$gte = srBeginDate;
    }
    if (!isNaN(srEndDate.getTime())) {
      // 다음날 00시 이전으로 설정 (SQL의 INTERVAL 1 DAY 대응)
      const nextDay = new Date(srEndDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.updatedAt.$lt = nextDay;
    }
  }

  const count = await db.collection(coName).countDocuments(filter);

  // 2. Query 실행
  const rows = await db
    .collection(coName)
    .find(filter)
    .sort({_id: 1 }) // ORDER BY ASC
    .skip(pageBegin) // LIMIT offset
    .limit(pageRow) // LIMIT count
    .toArray();

  return { rows, count };
};

// 상세조회
const etDetail = async (db: Db, id: string) => {
  // MongoDB의 _id가 ObjectId인 경우 처리
  const query = { _id: new ObjectId(id) };
  return await db.collection(coName).findOne(query);
};

// 생성
const etSave = async (db: Db, params: IDXAssets) => {
  const doc = {
    assetNode: params.assetNode,
    assetId: params.assetId,
    decimal: params.decimal,
    name: params.name,
    owner: params.owner,
    symbol: params.symbol,
    updatedAt: new Date(),
  };
  return await db.collection(coName).insertOne(doc);
};

// 수정
const etChange = async (db: Db, params: IDXAssets) => {
  return await db
    .collection(coName)
    .updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          assetNode: params.assetNode,
          assetId: params.assetId,
          decimal: params.decimal,
          name: params.name,
          owner: params.owner,
          symbol: params.symbol,
          updatedAt: new Date(),
        },
      },
    );
};

// 권한 수정
// const etPatchGrant = async (db: Db, params: any) => {
//   return await db.collection(coName).updateOne(
//     { menu_code: params.menu_code },
//     { $set: { grant: params.grant } }
//   );
// };

// 삭제 (Toggle is_use)
const etRemove = async (db: Db, id: string) => {
  // 현재 값을 가져와서 토글하거나, aggregation pipeline을 사용하여 업데이트
  const asset = await db.collection(coName).findOne({ _id: new ObjectId(id) });

  return await db
    .collection(coName)
    .deleteOne({ _id: new ObjectId(id) });
};

export default {
  etList,
  etDetail,
  etSave,
  etChange,
  etRemove,
};
