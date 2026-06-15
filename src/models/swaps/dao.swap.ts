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
          s.*
        FROM swap s
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE s.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND s.market_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt, srTxt);
        vQuery = vQuery + ` AND (s.address LIKE ? OR s.target_address LIKE ?)`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND s.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND s.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY s.swap_id DESC `;

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
          s.*
        FROM swap s
        WHERE s.swap_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO swap (
          swap_action,
          swap_status,
          swap_price,
          swap_volume,
          swap_fee,
          swap_txid,
          market_code,
          market_price,
          wallet_id,
          address,
          address_memo,
          target_market_code,
          target_market_price,
          target_wallet_id,
          target_address,
          target_address_memo,
          is_open,
          is_use,
          created_at,
          updated_at,
          pool_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), ?)
    `;

  vParams.push(
    params.swap_action,
    params.swap_status,
    params.swap_price,
    params.swap_volume,
    params.swap_fee,
    params.swap_txid,
    params.market_code,
    params.market_price,
    params.wallet_id,
    params.address,
    params.address_memo,
    params.target_market_code,
    params.target_market_price,
    params.target_wallet_id,
    params.target_address,
    params.target_address_memo,
    params.is_open,
    params.is_use,
    params.pool_id,
  );
  return await conn.query(vQuery, vParams);
};
// 수정
// const etChange = async (conn: any, params: any) => {};
// 패치
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE swap SET
    swap_status = ?
    WHERE swap_id = ?
    `;

  vParams.push(params.swap_status, params.swap_id);

  return await conn.query(vQuery, vParams);
};
const etPatchIsOpen = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE swap SET
    is_open = ?
    WHERE swap_id = ?
    `;

  vParams.push(params.is_open, params.swap_id);

  return await conn.query(vQuery, vParams);
};

// delete
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE swap
        SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE swap_id = ?
  `;
  return await conn.query(vQuery, vParams);
};


export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etPatchStatus,
  etPatchIsOpen,
  etRemove,
};