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

  var srBeginDate = new Date(!isNaN(params.srBeginDate) ? params.srBeginDate : null);
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : null);

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
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND bl.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND bl.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY bl.language_code ASC `;
  console.log("daoBaseLanguage etList vQuery", vQuery, vParams);
  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// detail
const etDetail = async (conn: any, ucode: string) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          bl.*
        FROM base_language bl
        WHERE bl.language_code = ?
    `;
  vParams.push(ucode);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO base_language (
          language_code,
          language_name,
          is_use
        ) VALUES (?, ?, ?)
    `;
  vParams.push(params.language_code, params.language_name, params.is_use);
  return await conn.query(vQuery, vParams);
};
// update
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE base_language SET
          language_name = ?
        WHERE language_code = ?
    `;
  vParams.push(
    params.language_name,   
    params.language_code
  );

  return await conn.query(vQuery, vParams);
};
// update
// const etPatchName = async (conn: any, params: any) => {
//   var vParams = new Array();

//   var vQuery = `
//         UPDATE base_language SET
//         language_name = ?
//         WHERE language_code = ?
//         `;

//   vParams.push(params.language_name, params.language_code);

//   return await conn.query(vQuery, vParams);
// };
// delete
const etRemove = async (conn: any, ucode: string) => {
  var vParams = new Array();

  vParams.push(ucode);
  var vQuery = `
        UPDATE base_language
        SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE language_code = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etRemove,
};
