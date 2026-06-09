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
        FROM board_favorite bf
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
        vQuery = vQuery + ` AND bf.board_id = ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND bf.wallet_id = ?`;
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

  vQuery = vQuery + ` ORDER BY bf.favorite_id DESC `;

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
        FROM board_favorite bf
        WHERE bf.favorite_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO board_favorite (
          board_id,
          wallet_id,
          is_use
        ) VALUES (?, ?, 1)
    `;
  vParams.push(params.board_id, params.wallet_id);
  return await conn.query(vQuery, vParams);
};
// 수정 할 내용이 없음
// const etChange = async (conn: any, params: any) => {};
// 패치 할 내용이 없음
// const etPatch = async (conn: any, params: any) => {};
// 삭제 및 복구
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE board_favorite SET
        is_use = (CASE WHEN is_use = 1 THEN 0 ELSE 1 END)
        WHERE favorite_id = ?
        `;

  vParams.push(id);

  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  // etChange,
  // etPatch,
  etRemove,
};
