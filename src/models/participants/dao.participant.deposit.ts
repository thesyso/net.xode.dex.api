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
  var srStatus = params.srStatus ? params.srStatus : "";
  var srOpen = params.srOpen ? params.srOpen : "";

  var vQuery = ` 
        SELECT SQL_CALC_FOUND_ROWS 
          pd.*
        FROM participant_deposit pd
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE pd.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE pd.participant_deposit_id IS NOT NULL`;
  }

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` AND pd.status = ?`;
  }

  if (srOpen) {
    vParams.push(srOpen);
    vQuery = vQuery + ` AND pd.is_open = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND pd.market_code LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND pd.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND pd.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY pd.participant_deposit_id DESC `;

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
          pd.*
        FROM participant_deposit pd
        WHERE pd.participant_deposit_id = ?
    `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};
// 저장
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    INSERT INTO participant_deposit (
      market_code,
      status,
      fee,
      fee_rate,
      is_open,
      is_use,
      swap_id,
      participant_id
    ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `;
  vParams.push(
    params.market_code,
    params.status,
    params.fee,
    params.fee_rate,
    params.is_open,
    params.swap_id,
    params.participant_id,
  );
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE participant_deposit p SET
      market_code = ?,
      status = ?,
      fee = ?,
      fee_rate = ?
    WHERE p.participant_deposit_id = ?
    `;
  vParams.push(
    params.market_code,
    params.status,
    params.fee,
    params.fee_rate,
    params.participant_deposit_id
  );

  return await conn.query(vQuery, vParams);
};

// 패치
const etPatchIsOpen = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE participant_deposit SET
    is_open = ?
    WHERE participant_deposit_id = ?
    `;
  vParams.push(params.is_open, params.participant_deposit_id);

  return await conn.query(vQuery, vParams);
};
// 삭제
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
    UPDATE participant_deposit
    SET is_use = CASE WHEN is_use = 1 THEN 0 ELSE 1 END
    WHERE participant_deposit_id = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchIsOpen,
  etRemove,
};