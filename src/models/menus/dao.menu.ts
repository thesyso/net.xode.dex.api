const etCount = async (conn: any) => {
  var vQuery = `SELECT FOUND_ROWS() as count`;
  return await conn.query(vQuery);
};
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
          m.*
        FROM menu m
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE m.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND m.menu_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND m.menu_name LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND m.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery = vQuery + ` AND m.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY m.menu_code ASC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, code: string) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          m.*
        FROM menu m
        WHERE m.menu_code = ?
    `;
  vParams.push(code);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO menu (
          menu_code,
          grant,
          menu_name,
          is_use
        ) VALUES (?, ?, ?, 1)
    `;
  vParams.push(params.menu_code, params.grant, params.menu_name);
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE menu SET
      menu_name = ?
    WHERE menu_code = ?
  `;
  vParams.push(
    params.menu_name,   
    params.menu_code
  );

  return await conn.query(vQuery, vParams);
};
// 수정
const etPatchGrant = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE menu SET
    grant = ?
    WHERE menu_code = ?
  `;

  vParams.push(params.grant, params.menu_code);

  return await conn.query(vQuery, vParams);
};
// delete
const etRemove = async (conn: any, code: string) => {
  var vParams = new Array();

  vParams.push(code);
  var vQuery = `
        UPDATE menu
        SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE menu_code = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchGrant,
  etRemove,
};