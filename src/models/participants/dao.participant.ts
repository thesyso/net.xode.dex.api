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
  var srUsed = params.srUsed ? params.srUsed : "";
  var srStatus = params.srStatus ? params.srStatus : "";
  var srIsOpen = params.srIsOpen ? params.srIsOpen : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          p.*
        FROM participant p
        WHERE p.participant_id IS NOT NULL
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` AND p.is_use = ?`;
  }

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` AND p.status = ?`;
  }

  if (srIsOpen) {
    vParams.push(srIsOpen);
    vQuery = vQuery + ` AND p.is_open = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt, srTxt);
        vQuery =
          vQuery + ` AND (p.market_code LIKE ? or p.market_target_code LIKE ?)`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND p.asset = ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND p.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }

  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND p.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY p.language_code ASC `;

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
          p.*
        FROM participant p
        WHERE p.participant_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO participant (
          market_code,
          market_target_code,
          status,
          asset,
          amount,
          target_amount,
          start_date,
          end_date,
          fee,
          fee_rate,
          withdrawal_fee,
          withdrawal_target_fee,
          is_open,
          is_use,
          pool_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `;
  vParams.push(
    params.market_code,
    params.market_target_code,
    params.status,
    params.asset,
    params.amount,
    params.target_amount,
    params.start_date,
    params.end_date,
    params.fee,
    params.fee_rate,
    params.withdrawal_fee,
    params.withdrawal_target_fee,
    params.is_open,
    params.pool_id,
  );
  return await conn.query(vQuery, vParams);
};
// 수정 할 수 없음. 취소 후 재진입해야 함.
// const etChange = async (conn: any, params: any) => {
// };

// 패치
// 1 : request, 2 : processing, 3 : failed, 5 : save, 7 : withdrawal, 9 : completed
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE participant SET
    status = ?
    WHERE participant_id = ?
    `;

  vParams.push(params.status, params.participant_id);

  return await conn.query(vQuery, vParams);
};
const etPatchIsOpen = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE participant SET
    is_open = ?
    WHERE participant_id = ?
    `;

  vParams.push(params.is_open, params.participant_id);

  return await conn.query(vQuery, vParams);
};

// delete
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE participant
        SET is_use = 0
        WHERE participant_id = ?
        AND is_use = 1
        AND status != 9
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
  // etChange,
};
