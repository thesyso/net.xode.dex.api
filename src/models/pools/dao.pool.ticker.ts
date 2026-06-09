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

  var vQuery = `
    SELECT SQL_CALC_FOUND_ROWS 
      pt.*
    FROM pool_ticker pt
    WHERE 1 = 1
  `;

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt, srTxt);
        vQuery = vQuery + ` AND (pt.market_code LIKE ? OR pt.market_target_code LIKE ?)`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND pt.ticker_date > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery = vQuery + ` AND pt.ticker_date < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
      vQuery +
      ` AND pt.ticker_date < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY pt.ticker_id DESC `;
  
  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;


  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = [id];
  var vQuery = `
        SELECT pt.*
        FROM pool_ticker pt
        WHERE pt.ticker_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO pool_ticker (
    ticker_id,
    ticker_date,
    price_begin_24,
    price_end_24,
    price_max_24,
    price_min_24,
    price_volumn_24,
    volumn_24,
    created_at,
    updated_at,
    pool_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`;

  return await conn.query(vQuery, [
    params.ticker_id,
    params.ticker_date,
    params.price_begin_24,
    params.price_end_24,
    params.price_max_24,
    params.price_min_24,
    params.price_volumn_24,
    params.volumn_24,
    params.pool_id,
  ]);
};

// 수정
const etChange = async (conn: any, params: any) => {
  var vQuery = `UPDATE pool_ticker
  SET price_begin_24 = ?, price_end_24 = ?, price_max_24 = ?, price_min_24 = ?, price_volumn_24 = ?, volumn_24 = ?, updated_at = NOW()
  WHERE ticker_id = ?`;
  return await conn.query(vQuery, [
    params.price_begin_24,
    params.price_end_24,
    params.price_max_24,
    params.price_min_24,
    params.price_volumn_24,
    params.volumn_24,
    params.ticker_id,
  ]);
};
const etChangeFromTickerDate = async (conn: any, params: any) => {
  var vQuery = `UPDATE pool_ticker
  SET price_begin_24 = ?, price_end_24 = ?, price_max_24 = ?, price_min_24 = ?, price_volumn_24 = ?, volumn_24 = ?, updated_at = NOW()
  WHERE ticker_date = ? and pool_id = ?`;
  return await conn.query(vQuery, [
    params.price_begin_24,
    params.price_end_24,
    params.price_max_24,
    params.price_min_24,
    params.price_volumn_24,
    params.volumn_24,
    params.ticker_date,
    params.pool_id
  ]);
};

// 패치
// 총시장가치와 예상수익률을 등록
const etPatchPriceEnd = async (conn: any, params: any) => {
  var vQuery = `UPDATE pool_ticker
  SET price_end_24 = ?, updated_at = NOW() 
  WHERE ticker_id = ?`;
  return await conn.query(vQuery, [params.price_end_24, params.ticker_id]);
};
const etPatchPriceEndFromTickerDate = async (conn: any, params: any) => {
  var vQuery = `UPDATE pool_ticker
  SET price_end_24 = ?, updated_at = NOW() 
  WHERE ticker_date = ? and pool_id = ?`;
  return await conn.query(vQuery, [params.price_end_24, params.ticker_date, params.pool_id]);
};

// delete
const etRemove = async (conn: any, id: number) => {
  var vQuery = `DELETE FROM pool_ticker WHERE ticker_id = ?`;
  return await conn.query(vQuery, [id]);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etChangeFromTickerDate,
  etPatchPriceEnd,
  etPatchPriceEndFromTickerDate,
  etRemove,
};
