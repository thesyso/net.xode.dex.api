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
          mt.*
        FROM market_ticker mt
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE mt.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND mt.market_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND mt.exchange_code LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND mt.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND mt.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY mt.market_ticker_id DESC `;
  
  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};

// 상세 조회
const etDetail = async (conn: any, market_ticker_id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          mt.*
        FROM market_ticker mt
        WHERE mt.market_ticker_id = ?
    `;
  vParams.push(market_ticker_id);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};

// 생성
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO market_ticker (
          workdated,
          price_begin_24,
          price_end_24,
          price_max_24,
          price_min_24,
          price_volume_24,
          volume_24,
          market_code,
          exchange_code,
          is_use
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
  vParams.push(
    params.workdated,
    params.price_begin_24,
    params.price_end_24,
    params.price_max_24,
    params.price_min_24,
    params.price_volume_24,
    params.volume_24,
    params.market_code,
    params.exchange_code
  );

  return await conn.query(vQuery, vParams);
};

// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market_ticker SET
          workdated = ?,
          price_begin_24 = ?,
          price_end_24 = ?,
          price_max_24 = ?,
          price_min_24 = ?,
          price_volume_24 = ?,
          volume_24 = ?,
          market_code = ?,
          exchange_code = ?
        WHERE market_ticker_id = ?
    `;
  vParams.push(
    params.workdated,
    params.price_begin_24,
    params.price_end_24,
    params.price_max_24,
    params.price_min_24,
    params.price_volume_24,
    params.volume_24,
    params.market_code,
    params.exchange_code,
    params.market_ticker_id
  );

  return await conn.query(vQuery, vParams);
};

// 부분 패치
const etPatch = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market_ticker SET
        price_end_24 = COALESCE(?, price_end_24),
        price_max_24 = COALESCE(?, price_max_24),
        price_min_24 = COALESCE(?, price_min_24),
        price_volume_24 = COALESCE(?, price_volume_24),
        volume_24 = COALESCE(?, volume_24)
        WHERE market_ticker_id = ?
        `;

  vParams.push(
    params.price_end_24,
    params.price_max_24,
    params.price_min_24,
    params.price_volume_24,
    params.volume_24,
    params.market_ticker_id
  );

  return await conn.query(vQuery, vParams);
};
const etPatchWorkDate = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market_ticker SET
        workdated = COALESCE(?, workdated)
        WHERE market_ticker_id = ?
        `;

  vParams.push(
    params.workdated,
    params.market_ticker_id
  );

  return await conn.query(vQuery, vParams);
};
const etPatchMarketCode = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market_ticker SET
        market_code = COALESCE(?, market_code)
        WHERE market_ticker_id = ?
        `;

  vParams.push(
    params.market_code,
    params.market_ticker_id
  );

  return await conn.query(vQuery, vParams);
};
const etPatchExchangeCode = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market_ticker SET
        exchange_code = COALESCE(?, exchange_code)
        WHERE market_ticker_id = ?
        `;

  vParams.push(
    params.exchange_code,
    params.market_ticker_id
  );

  return await conn.query(vQuery, vParams);
};


// 삭제
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE market_ticker
        SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE market_ticker_id = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatch,
  etPatchWorkDate,
  etPatchMarketCode,
  etPatchExchangeCode,
  etRemove,
};