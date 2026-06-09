import { Db, ObjectId } from "mongodb";
import { IDXTransaction } from "./dto.node";
import { hash } from "node:crypto";

const coName = "transactions";
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
    else if (params.sr == 2) filter.assetNode = regex;
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

  // 2. Query 실행
  const rows = await db
    .collection(coName)
    .find(filter)
    .sort({ assetId: 1 }) // ORDER BY ASC
    .skip(pageBegin) // LIMIT offset
    .limit(pageRow) // LIMIT count
    .toArray();

  // FOUND_ROWS() 대응을 위해 전체 개수도 함께 반환하는 것이 효율적입니다.
  const count = await db.collection(coName).countDocuments(filter);
  console.log("etList filter:", filter, "rows length:", rows.length, "total count:", count);
  return { rows, count };
};

// 상세조회
// const etDetail = async (db: Db, id: string) => {
//   // MongoDB의 _id가 ObjectId인 경우 처리
//   const query = { _id: new ObjectId(id) };
//   return await db.collection(coName).findOne(query);
// };

// 생성
// const etSave = async (db: Db, params: IDXTransaction) => {
//   const doc = {
//     hash: params.hash,
//     amount: params.amount,
//     assetCode: params.assetCode,
//     assetId: params.assetId,
//     blockNumber: params.blockNumber,
//     fee: params.fee,
//     from: params.from,
//     method: params.method,
//     module: params.module,
//     success: params.success,
//     timestamp: params.timestamp,
//     tip: params.tip,
//     to: params.to,
//     updatedAt: new Date(),
//   };
//   return await db.collection(coName).insertOne(doc);
// };

// 수정
// const etChange = async (db: Db, params: IDXTransaction) => {
//   return await db
//     .collection(coName)
//     .updateOne(
//       { _id: new ObjectId(params.id) },
//       {
//         $set: {
//           hash: params.hash,
//           amount: params.amount,
//           assetCode: params.assetCode,
//           assetId: params.assetId,
//           blockNumber: params.blockNumber,
//           fee: params.fee,
//           from: params.from,
//           method: params.method,
//           module: params.module,
//           success: params.success,
//           timestamp: params.timestamp,
//           tip: params.tip,
//           to: params.to
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
  // etDetail,
  // etSave,
  // etChange,
  etRemove,
};
