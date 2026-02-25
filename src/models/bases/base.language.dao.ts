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

  var srBeginDate = new Date(
    !isNaN(params.srBeginDate) ? params.srBeginDate : "",
  );
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : "");

  //
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          bl.*
        FROM base_language bl
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE bl.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE bl.language_code IS NOT NULL`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND bl.language_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND bl.language_name LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND bl.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND bl.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY bl.language_code ASC `;
  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// detail
const etDetail = async (conn: any, language_id: number) => {};
// create
const etSave = async (conn: any, params: any) => {};
// update
const etChange = async (conn: any, params: any) => {};
// update
const etPatch = async (conn: any, params: any) => {};
// delete
const etRemove = async (conn: any, params: any) => {};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatch,
  etRemove,
};
