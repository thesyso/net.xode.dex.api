const etCount = async (conn: any) => {
  var vQuery = `SELECT FOUND_ROWS() as count`;
  return await conn.query(vQuery);
};

// 조회
const etList = async (conn: any, params: any) => {
  var pageRow = params.pageRow ? params.pageRow : 10;
  var pageBegin = params.page ? (params.page - 1) * pageRow : 0;

  var vParams = new Array();

  var srMode = params.srMode ? params.srMode : "";

  var sr = params.sr ? params.sr : 0;
  var srTxt = params.srTxt?.length > 0 ? `%` + params.srTxt + `%` : "";

  var srBeginDate = !isNaN(params.srBeginDate) && params.srBeginDate ? new Date(params.srBeginDate) : null;
  var srEndDate = !isNaN(params.srEndDate) && params.srEndDate ? new Date(params.srEndDate) : null;

  var vQuery = `
      SELECT SQL_CALC_FOUND_ROWS 
        t.*
      FROM transaction t
  `;

  if (srMode) {
    vParams.push(srMode);
    vQuery = vQuery + ` WHERE t.mode = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt, srTxt);
        vQuery = vQuery + ` AND t.tx_id LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt, srTxt);
        vQuery =
          vQuery + ` AND (t.market_code LIKE ? OR t.market_target_code LIKE ?)`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND t.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND t.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY t.transaction_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};

// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vQuery = `
      SELECT 
        t.*
      FROM transaction t
      WHERE t.transaction_id = ?
  `;

  return await conn.query(vQuery, [id]);
};

// 저장
const etSave = async (conn: any, params: any) => {
  var vQuery = `
      INSERT INTO transaction (
        mode, 
        tx_id, 
        status,
        market_code, 
        market_target_code, 
        amount, 
        amount_target, 
        fee, 
        fee_rate, 
        pool_id, 
        swap_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return await conn.query(vQuery, [
    params.mode,
    params.tx_id,
    params.status,
    params.market_code,
    params.market_target_code,
    params.amount,
    params.amount_target,
    params.fee,
    params.fee_rate,
    params.pool_id,
    params.swap_id,
  ]);
};

// 
const etPatchStatus = async (conn: any, params: any) => {
  var vQuery = `
    UPDATE transaction SET
      status = ?
    WHERE transaction_id = ?
  `;

  return await conn.query(vQuery, [params.status, params.transaction_id]);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etPatchStatus,
};