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
          m.*
        FROM market m
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
        vQuery = vQuery + ` AND m.market_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND m.market_name LIKE ?`;
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

  vQuery = vQuery + ` ORDER BY m.market_code ASC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};

// 상세조회
const etDetail = async (conn: any, ucode: string) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          m.*
        FROM market m
        WHERE m.market_code = ?
    `;
  vParams.push(ucode);

  return await conn.query(vQuery, vParams);
};

// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO market (
          market_code,
          market_name,
          price_begin_24,
          price_end_24,
          price_max_12,
          price_min_12,
          private_volumn_24,
          volumn_24,
          gas,
          is_use
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
  vParams.push(
    params.market_code,
    params.market_name,
    params.price_begin_24,
    params.price_end_24,
    params.price_max_12,
    params.price_min_12,
    params.private_volumn_24,
    params.volumn_24,
    params.gas,
  );
  return await conn.query(vQuery, vParams);
};

// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market SET
          market_name = ?,
          price_begin_24 = ?,
          price_end_24 = ?,
          price_max_12 = ?,
          price_min_12 = ?,
          private_volumn_24 = ?,
          volumn_24 = ?
        WHERE market_code = ?
    `;
  vParams.push(
    params.market_name,
    params.price_begin_24,
    params.price_end_24,
    params.price_max_12,
    params.price_min_12,
    params.private_volumn_24,
    params.volumn_24,
    params.market_code
  );

  return await conn.query(vQuery, vParams);
};

// 부분 수정
const etPatchGas = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE market SET
          gas = ?,
          updated_at = NOW()
        WHERE market_code = ?
        `;

  vParams.push(params.gas, params.market_code);

  return await conn.query(vQuery, vParams);
};

// 삭제
const etRemove = async (conn: any, ucode: string) => {
  var vParams = new Array();

  vParams.push(ucode);
  var vQuery = `
        UPDATE market
        SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE market_code = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchGas,
  etRemove,
};