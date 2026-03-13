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
  var srStatus = params.srStatus ? params.srStatus : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          wt.*
        FROM wallet_transaction wt
        WHERE wt.scan_hash IS NOT NULL
    `;

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` AND wt.status = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND wt.scan_hash LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND wt.wallet_from LIKE ?`;
        break;
      case sr == 3:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND wt.wallet_to LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND wt.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND wt.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY wt.created_at DESC `;

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
          wt.*
        FROM wallet_transaction wt
        WHERE wt.transaction_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO wallet_transaction (
          mainnet,
          scan_hash,
          status,
          block
          confirm_block,
          wallet_from,
          wallet_from_memo,
          wallet_to,
          wallet_to_memo,
          amount_fee,
          amount_gas,
          amount_value,
          wallet_id
        ) VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  vParams.push(
    params.mainnet,
    params.scan_hash,
    params.block,
    params.confirm_block,
    params.wallet_from,
    params.wallet_from_memo,
    params.wallet_to,
    params.wallet_to_memo,
    params.amount_fee,
    params.amount_gas,
    params.amount_value,
    params.wallet_id,
  );
  return await conn.query(vQuery, vParams);
};
// 수정 할 내용이 없음
// const etChange = async (conn: any, params: any) => {};
// 패치
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE wallet_transaction SET
    status = ?
    WHERE transaction_id = ?
    `;

  vParams.push(params.status, params.transaction_id);

  return await conn.query(vQuery, vParams);
};
// 삭제
const etRemove = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE wallet_transaction
        SET status = ?
        WHERE transaction_id = ?
  `;

  vParams.push(params.status, params.transaction_id);

  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etPatchStatus,
  etRemove,
};