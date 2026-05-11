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

  var srBeginDate = new Date(
    !isNaN(params.srBeginDate) ? params.srBeginDate : null,
  );
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : null);

  //
  var srStatus = params.srStatus ? params.srStatus : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          *
        FROM user_wallet uw
    `;

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` WHERE uw.status = ?`;
  } else {
    vQuery = vQuery + ` WHERE uw.user_wallet_id IS NOT NULL`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND w.signature LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND uw.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND uw.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY uw.user_wallet_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
const etListInWallet = async (conn: any, params: any) => {
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
          uw.*,
          w.wallet_class,
          w.wallet_mode,
          w.wallet_name,
          w.mainnet,
          w.coin_code,
          w.address,
          w.address_memo,
          w.is_use,
        FROM user_wallet uw
        LEFT JOIN wallet w ON uw.wallet_id = w.wallet_id
    `;

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` WHERE uw.status = ?`;
  } else {
    vQuery = vQuery + ` WHERE uw.user_wallet_id IS NOT NULL`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND w.coin_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND w.address LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND uw.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND uw.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY uw.user_wallet_id DESC `;

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
          uw.*
        FROM user_wallet uw
        WHERE uw.user_wallet_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
const etDetailInWallet = async (conn: any, id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          uw.*,
          w.wallet_class,
          w.wallet_mode,
          w.wallet_name,
          w.mainnet,
          w.coin_code,
          w.address,
          w.address_memo,
          w.is_use
        FROM user_wallet uw
        LEFT JOIN wallet w ON uw.wallet_id = w.wallet_id
        WHERE uw.user_wallet_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
const etDetailByWalletId = async (conn: any, walletId: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          uw.*
        FROM user_wallet uw
        WHERE uw.wallet_id = ?
    `;
  vParams.push(walletId);

  return await conn.query(vQuery, vParams);
};

// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO user_wallet (
          status,
          signature,
          created_at,
          updated_at,
          wallet_id,
          user_id
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;
  vParams.push(
    params.status,
    params.signature,
    params.created_at,
    params.updated_at,
    params.wallet_id,
    params.user_id,
  );
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE user_wallet SET
          signature = ?
        WHERE user_wallet_id = ?
    `;
  vParams.push(params.signature, params.user_wallet_id);

  return await conn.query(vQuery, vParams);
};
// 수정
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE user_wallet SET
        status = ?
        WHERE user_wallet_id = ?
        AND status != 0
        `;

  vParams.push(params.status, params.user_wallet_id);

  return await conn.query(vQuery, vParams);
};
// delete
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE user_wallet
        SET status = CASE WHEN status = 1 THEN 0 ELSE 1 END
        WHERE user_wallet_id = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etListInWallet,
  etDetail,
  etDetailInWallet,
  etDetailByWalletId,
  etSave,
  etChange,
  etPatchStatus,
  etRemove,

};
