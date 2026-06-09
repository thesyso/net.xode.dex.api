const etCount = async (conn: any) => {
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
          bf.*
        FROM board_file bf
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE bf.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND (bf.file_name LIKE ? OR bf.origin_name LIKE ?)`;
        vParams.push(srTxt);
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND bf.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND bf.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY bf.file_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};

// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          bf.*
        FROM board_file bf
        WHERE bf.file_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};

// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO board_file (
          file_name,
          origin_name,
          is_use
        ) VALUES (?, ?, 1)
    `;
  vParams.push(params.file_name, params.origin_name);
  return await conn.query(vQuery, vParams);
};

// 수정 할 내용이 없음
// const etChange = async (conn: any, params: any) => {};

// 패치 할 내용이 없음
// const etPatch = async (conn: any, params: any) => {};

// 삭제
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE board_file
        SET is_use = 0
        WHERE file_id = ?
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