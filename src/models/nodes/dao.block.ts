import { Db, ObjectId } from "mongodb";
import { IDXBlock } from "./dto.node";

const coName = "blocks";
// 목록 개수 조회 (Pagination을 위한 전체 카운트)
const etCount = async (db: Db, filter: any) => {
  // etList에서 만든 filter와 동일한 조건을 전달받아야 합니다.
  return await db.collection(coName).countDocuments(filter);
};

// 목록 조회
const etList = async (db: Db, params: any) => {
  const pageRow = params.pageRow ? parseInt(params.pageRow) : 10;
  const pageBegin = params.page ? (parseInt(params.page) - 1) * pageRow : 0;

  // 1. Filter(Where 조건) 생성
  let filter: any = {};

  // 검색어 (LIKE 처리)
  if (params.sr != 0 && params.srTxt?.length > 0) {
    const regex = new RegExp(params.srTxt, "i"); // case-insensitive LIKE %txt%
    if (params.sr == 1) filter.blockNumber = regex;
    else if (params.sr == 2) filter.blockHash = regex;
  }

  // 날짜 검색
  const srBeginDate = new Date(params.srBeginDate);
  const srEndDate = new Date(params.srEndDate);

  if (!isNaN(srBeginDate.getTime()) || !isNaN(srEndDate.getTime())) {
    filter.timestamp = {};
    if (!isNaN(srBeginDate.getTime())) {
      filter.timestamp.$gte = srBeginDate;
    }
    if (!isNaN(srEndDate.getTime())) {
      // 다음날 00시 이전으로 설정 (SQL의 INTERVAL 1 DAY 대응)
      const nextDay = new Date(srEndDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.timestamp.$lt = nextDay;
    }
  }

  const count = await db.collection(coName).countDocuments(filter);

  // 2. Query 실행
  const rows = await db
    .collection(coName)
    .find(filter)
    .sort({ blockNumber: -1 }) // ORDER BY blockNumber DESC
    .skip(pageBegin) // LIMIT offset
    .limit(pageRow) // LIMIT count
    .toArray();

  // FOUND_ROWS() 대응을 위해 전체 개수도 함께 반환하는 것이 효율적입니다.
  

  return { rows, count };
};

// 상세조회
const etDetail = async (db: Db, id: string) => {
  // MongoDB의 _id가 ObjectId인 경우 처리
  const query = { _id: new ObjectId(id) };
  return await db.collection(coName).findOne(query);
};

// 생성
// const etSave = async (db: Db, params: IDXBlock) => {
//   const doc = {
//     blockHash: params.blockHash,
//     blockNumber: params.blockNumber,
//     rawData: params.rawData,
//     summary: params.summary,
//     timestamp: params.timestamp,
//     transactions: params.transactions,
//   };
//   return await db.collection(coName).insertOne(doc);
// };

// 수정
// const etChange = async (db: Db, params: IDXBlock) => {
//   return await db
//     .collection(coName)
//     .updateOne(
//       { _id: new ObjectId(params.id) },
//       {
//         $set: {
//           blockHash: params.blockHash,
//           blockNumber: params.blockNumber,
//           rawData: params.rawData,
//           summary: params.summary,
//           timestamp: params.timestamp,
//           transactions: params.transactions,
//         },
//       },
//     );
// };

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
  const menu = await db.collection(coName).findOne({ _id: new ObjectId(id) });

  return await db
    .collection(coName)
    .deleteOne({ _id: new ObjectId(id) });
};

export default {
  etCount,
  etList,
  etDetail,
  // etSave,
  // etChange,
  etRemove,
};
