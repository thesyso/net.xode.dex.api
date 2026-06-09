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

  var srBeginDate = new Date(!isNaN(params.srBeginDate) ? params.srBeginDate : null);
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : null);

  //
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          a.*
        FROM asset a
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
        vQuery = vQuery + ` AND a.asset_id LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND a.asset_name LIKE ?`;
        break;
      case sr == 3:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND a.asset_symbol LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND a.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND a.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY a.asset_id, a.asset_node DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, asset_id: string, asset_node: string) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          a.*
        FROM asset a
        WHERE a.asset_id = ? AND a.asset_node = ?
    `;
  vParams.push(asset_id, asset_node);

  // console.log("daoBaseExchange etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO asset (
          asset_id,
          asset_node,
          asset_name,
          asset_symbol,
          asset_status,
          asset_decimal,
          is_use
        ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `;
  vParams.push(params.asset_id, params.asset_node, params.asset_name, params.asset_symbol, params.asset_status, params.asset_decimal);
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE asset SET
          asset_name = ?,
          asset_symbol = ?,
          asset_decimal = ?
        WHERE asset_id = ? AND asset_node = ?
    `;
  vParams.push(
    params.asset_name,
    params.asset_symbol,
    params.asset_decimal,
    params.asset_id,
    params.asset_node
  );  

  return await conn.query(vQuery, vParams);
};
// 패치 할 내용이 없음
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE asset SET
        asset_status = ?
        WHERE asset_id = ? AND asset_node = ?
        `;

  vParams.push(params.asset_status, params.asset_id, params.asset_node);

  return await conn.query(vQuery, vParams);
};
// delete
const etRemove = async (conn: any, asset_id: string, asset_node: string) => {
  var vParams = new Array();

  vParams.push(asset_id, asset_node);
  var vQuery = `
        UPDATE asset SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE asset_id = ? AND asset_node = ?
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
