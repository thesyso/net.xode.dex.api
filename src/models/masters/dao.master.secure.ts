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
  var srMasterId = params.srMasterId ? params.srMasterId : "";
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          ms.*
        FROM master_secure ms
    `;
  
  if (srUsed) {
      vParams.push(srUsed);
      vQuery = vQuery + ` WHERE ms.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE ms.secure_id IS NOT NULL`;
  }

  if(srMasterId){
    vParams.push(srMasterId);
    vQuery = vQuery + ` AND ms.master_id = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND ms.secure_code LIKE ?`;
        vParams.push(srTxt);
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND ms.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND ms.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY ms.secure_id DESC `;

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
          ms.*
        FROM master_secure ms
        WHERE ms.secure_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO master_secure (
          class,
          secure_code,
          is_commit,
          is_use,
          limited_at,
          created_at,
          updated_at,
          master_id
        ) VALUES (?, ?, 0, 1, ?, NOW(), NOW(), ?)
    `;
  vParams.push(params.class, params.secure_code, params.limited_at, params.master_id);
  return await conn.query(vQuery, vParams);
};
// 수정
// const etChange = async (conn: any, params: any) => {};
// 패치
const etPatchCommit = async (conn: any, params: any) => {
  var vQuery = `UPDATE master_secure 
  SET is_commit = 1, updated_at = NOW() 
  WHERE secure_id = ? AND secure_code = ? AND is_use = 1 AND is_commit = 0 AND limited_at > NOW()`;
  return await conn.query(vQuery, [params.secure_id, params.secure_code]);
};
// 삭제
const etRemove = async (conn: any, id: number) => {
  var vQuery = `UPDATE master_secure SET is_use = 0 WHERE secure_id = ? AND is_use = 1`;
  return await conn.query(vQuery, [id]);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etPatchCommit,
  etRemove,
  // etChange,
};
