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
  var srWalletClass = params.srWalletClass ? params.srWalletClass : "";
  var srWalletChain = params.srWalletChain ? params.srWalletChain : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          w.*
        FROM wallet w
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE w.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  if (srWalletClass) {
    vParams.push(srWalletClass);
    vQuery = vQuery + ` AND w.wallet_class = ?`;
  }

  if (srWalletChain) {
    vParams.push(srWalletChain);
    vQuery = vQuery + ` AND w.wallet_chain = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt, srTxt);
        vQuery = vQuery + ` AND (w.address LIKE ? OR w.wallet_name LIKE ?)`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND w.mainnet LIKE ?`;
        break;
      case sr == 3:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND w.coin_code LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND w.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND w.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY w.wallet_id DESC `;

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
          w.*
        FROM wallet w
        WHERE w.wallet_id = ?
    `;
  vParams.push(id);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};

const etDetailAsOtherKey = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          w.*
        FROM wallet w
        WHERE w.mainnet = ? AND w.coin_code = ? AND w.address = ?
    `;
  vParams.push(params.mainnet, params.coin_code, params.address);

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO wallet (
          wallet_class,
          wallet_chain,
          wallet_name,
          mainnet,
          coin_code,
          address,
          address_memo,
          is_use
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;
  vParams.push(
    params.wallet_class,
    params.wallet_chain,
    params.wallet_name,
    params.mainnet,
    params.coin_code,
    params.address,
    params.address_memo,
  );
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE wallet SET
      wallet_class = ?,
      wallet_chain = ?,
      wallet_name = ?
    WHERE wallet_id = ?
`;
  vParams.push(
    params.wallet_class,
    params.wallet_chain,
    params.wallet_name,   
    params.wallet_id
  );

  return await conn.query(vQuery, vParams);
};
// 패치 할 내용이 없음
// const etPatch = async (conn: any, params: any) => {};
// 삭제
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE wallet 
        SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
        WHERE wallet_id = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etDetailAsOtherKey,
  etSave,
  etChange,
  // etPatch,
  etRemove,
};