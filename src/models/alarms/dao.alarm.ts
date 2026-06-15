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

  var srBeginDate = !isNaN(params.srBeginDate) && params.srBeginDate ? new Date(params.srBeginDate) : null;
  var srEndDate = !isNaN(params.srEndDate) && params.srEndDate ? new Date(params.srEndDate) : null;

  //
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          a.*
        FROM alarm a
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE a.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND a.alarm_id LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND a.contents LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND a.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery = vQuery + ` AND a.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY a.alarm_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, alarm_id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          a.*
        FROM alarm a
        WHERE a.alarm_id = ?
    `;
  vParams.push(alarm_id);

  // console.log("daoBaseExchange etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO alarm (
          status,
          contents,
          is_notice,
          is_use,
          sended_at,
          created_at,
          updated_at
        ) VALUES (1, ?, ?, 1, ?, NOW(), NOW())
    `;
  vParams.push(params.contents, params.isNotice, params.sended_at); 
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE alarm SET
          contents = ?,
          updated_at = NOW()
        WHERE alarm_id = ?
    `;
  vParams.push(params.contents, params.alarm_id);  

  return await conn.query(vQuery, vParams);
};
// 패치 할 내용이 없음
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE alarm SET
        alarm_status = ?,
        sended_at = CASE WHEN ? = 2 THEN NOW() ELSE sended_at END,
        updated_at = NOW()
        WHERE alarm_id = ?
        `;

  vParams.push(params.alarm_status, params.alarm_status, params.alarm_id);

  return await conn.query(vQuery, vParams);
};
// delete
const etRemove = async (conn: any, alarm_id: number) => {
  var vParams = new Array();

  vParams.push(alarm_id);
  var vQuery = `
        UPDATE alarm SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE alarm_id = ?
  `;
   return await conn.query(vQuery, vParams);
}

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchStatus,
  etRemove,
};
