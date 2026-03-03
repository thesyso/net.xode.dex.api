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

  var srBeginDate = new Date(!isNaN(params.srBeginDate) ? params.srBeginDate : null);
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : null);

  //
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          mi.*
        FROM market_i18n mi
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE mi.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE mi.marekt_i18n_id IS NOT NULL`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND mi.market_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt, srTxt);
        vQuery = vQuery + ` AND (mi.language_code LIKE ? OR mi.language_name LIKE ?)`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND mi.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND mi.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY mi.market_code ASC, mi.language_code ASC `;

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
          mi.*
        FROM market_i18n mi
        WHERE mi.market_code = ?
    `;
  vParams.push(ucode);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {};
// update
const etChange = async (conn: any, params: any) => {};
// update
const etPatch = async (conn: any, params: any) => {};
// delete
const etRemove = async (conn: any, params: any) => {};
