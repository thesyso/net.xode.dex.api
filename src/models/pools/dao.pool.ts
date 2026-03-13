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

  var srUsed = params.srUsed ? params.srUsed : "";
  var srProtocol = params.srProtocol ? params.srProtocol : "";
  var srIsMain = params.srIsMain ? params.srIsMain : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          p.*
        FROM pool p
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE p.used = ?`;
  } else {
    vQuery = vQuery + ` WHERE p.pool_id IS NOT NULL`;
  }

  if (srProtocol) {
    vParams.push(srProtocol);
    vQuery = vQuery + ` AND p.protocol = ?`;
  }

  if (srIsMain) {
    vParams.push(srIsMain);
    vQuery = vQuery + ` AND p.is_main = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt, srTxt);
        vQuery =
          vQuery + ` AND (p.market_code LIKE ? OR p.market_target_code LIKE ?)`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND p.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND p.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;
  vQuery = vQuery + ` ORDER BY p.pool_id DESC `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = [id];
  var vQuery = `
        SELECT p.*
        FROM pool p
        WHERE p.pool_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO pool (
    market_code,
    market_target_code,
    protocol,
    asset,
    amount,
    target_amount,
    fee_rate,
    reward,
    total_value_locked,
    annual_percentage_rate,
    is_main,
    is_use,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
  return await conn.query(vQuery, [
    params.market_code,
    params.market_target_code,
    params.protocol,
    params.asset,
    params.amount,
    params.target_amount,
    params.fee_rate,
    params.reward,
    params.total_value_locked,
    params.annual_percentage_rate,
    params.is_main,
    params.is_use
  ]);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vQuery = `UPDATE pool
  SET asset = ?, amount = ?, target_amount = ?, updated_at = NOW() 
  WHERE pool_id = ? AND status = 1`;
  return await conn.query(vQuery, [
    params.asset,
    params.amount,
    params.target_amount,
    params.pool_id,
  ]);
};
// 패치
// 총시장가치와 예상수익률을 등록
const etPatchTrade = async (conn: any, params: any) => {
  var vQuery = `UPDATE pool
  SET amount = ?, target_amount = ?, updated_at = NOW() 
  WHERE pool_id = ? AND status = 1`;
  return await conn.query(vQuery, [
    params.asset,
    params.amount,
    params.target_amount,
    params.pool_id,
  ]);
};
// delete
const etRemove = async (conn: any, id: number) => {
  var vQuery = `UPDATE pool SET status = 0 WHERE pool_id = ? AND is_use = 1`;
  return await conn.query(vQuery, [id]);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchTrade,
  etRemove,
};