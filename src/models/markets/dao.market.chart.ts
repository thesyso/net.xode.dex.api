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
          mi.*
        FROM market_chart mc
        WHERE 1 = 1
    `;

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND mc.exchange_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt, srTxt);
        vQuery =
          vQuery + ` AND mc.market_code LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND mc.work_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery = vQuery + ` AND mc.work_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;  
  }

  vQuery = vQuery + ` ORDER BY mc.exchange_code ASC, mc.market_code ASC, mc.work_at ASC `;

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
          mc.*
        FROM market_chart mc
        WHERE mc.market_chart_id = ?
    `;
  vParams.push(id);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO market_chart (
          exchange_code,
          market_code,
          work_at,
          price_open,
          price_high,
          price_low,
          privce_volumn,
          asset_volumn,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  vParams.push(
    params.exchange_code,
    params.market_code,
    params.work_at,
    params.price_open,
    params.price_high,
    params.price_low,
    params.privce_volumn,
    params.asset_volumn,
    new Date(),
  );
  return await conn.query(vQuery, vParams);
};

// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market_chart SET
          price_high = ?,
          price_low = ?,
          privce_volumn = ?,
          asset_volumn = ?
        WHERE exchange_code = ? AND market_code = ? AND work_at = ?
    `;
  vParams.push(
    params.price_high,
    params.price_low,
    params.privce_volumn,
    params.asset_volumn,
    params.exchange_code,
    params.market_code,
    params.work_at
  );

  return await conn.query(vQuery, vParams);
};
// 패치 할 내용이 없음
// const etPatch = async (conn: any, params: any) => {};
// 삭제
// const etRemove = async (conn: any, id: number) => {
//   var vParams = new Array();

//   var vQuery = `
//         UPDATE market_i18n
//         SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
//         WHERE market_i18n_id = ?
//     `;
//   vParams.push(id);
//   return await conn.query(vQuery, vParams);
// };

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  // etPatch,
  // etRemove,
};