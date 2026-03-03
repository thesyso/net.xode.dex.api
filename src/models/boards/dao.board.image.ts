const etCount = async (conn: any, params: any) => {
  var vQuery = `SELECT FOUND_ROWS() as count`;
  return await conn.query(vQuery);
};
// 조회
const etList = async (conn: any, params: any) => {
  var pageRow = params.pageRow ? params.pageRow : 10;
  var pageBegin = params.page ? (params.page - 1) * pageRow : 0;

  var vParams = new Array();

  var sr = params.sr ? params.sr : 0;
  var srTxt = params.srTxt?.length > 0 ? `%` + params.srTxt + `%` : "";

  var srBeginDate = new Date(
    !isNaN(params.srBeginDate) ? params.srBeginDate : null,
  );
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : null);

  //
  var srUsed = params.srUsed ? params.srUsed : "";
  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          bi.*
        FROM board_image bi
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE bi.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE bi.image_id IS NOT NULL`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND (bi.file_name LIKE ? OR bi.origin_name LIKE ?)`;
        vParams.push(srTxt);
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND bi.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND bi.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY bi.image_id ASC `;
  // console.log("daoBaseLanguage etList vQuery", vQuery, vParams);
  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};

// 상세조회
const etDetail = async (conn: any, uid: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          bi.*
        FROM board_image bi
        WHERE bi.image_id = ?
    `;
  vParams.push(uid);

  return await conn.query(vQuery, vParams);
};

// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO board_image (
          file_name,
          origin_name,
          is_use
        ) VALUES (?, ?, 1)
    `;
  vParams.push(params.file_name, params.origin_name);
  return await conn.query(vQuery, vParams);
};

// 업데이트 할 내용이 없음
// const etChange = async (conn: any, params: any) => {};

// 패치 할 내용이 없음
// const etPatch = async (conn: any, params: any) => {};

// 삭제
const etRemove = async (conn: any, uid: number) => {
  var vParams = new Array();

  vParams.push(uid);
  var vQuery = `
        UPDATE board_image
        SET is_use = 0
        WHERE image_id = ?
  `;
  return await conn.query(vQuery, vParams);
};

/// 파일 종류는 등록 또는 삭제 진행
export default {
  etCount,
  etList,
  etDetail,
  etSave,
  // etChange,
  // etPatch,
  etRemove,
};