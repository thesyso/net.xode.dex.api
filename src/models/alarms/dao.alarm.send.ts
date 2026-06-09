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
          as.*,
          a.status,
          a.contents,
          a.is_notice,
          a.is_use,
          a.sended_at,
          a.created_at,
          a.updated_at
        FROM alarm_send as
        LEFT OUTER JOIN alarm a ON alarm_send.alarm_id = a.alarm_id
        WHERE 1 = 1
    `;

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND a.contents LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND a.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND a.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY as.send_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, send_id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          as.*,
          a.status,
          a.contents,
          a.is_notice,
          a.is_use,
          a.sended_at,
          a.created_at,
          a.updated_at
        FROM alarm_send as
        LEFT OUTER JOIN alarm a ON alarm_send.alarm_id = a.alarm_id
        WHERE as.send_id = ?
    `;
  vParams.push(send_id);

  // console.log("daoBaseExchange etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};

const etDetailIsExist = async (conn: any, sParams: any) => {
  var vParams = new Array();
  var vQuery = `
        SELECT 
          *
        FROM alarm_send 
        WHERE alarm_id = ? and user_wallet_id = ?
    `;
  vParams.push(sParams.alarm_id, sParams.user_wallet_id);
  return await conn.query(vQuery, vParams);
};

// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        INSERT INTO alarm_send (
          created_at,
          updated_at,
          alarm_id,
          user_wallet_id
        ) VALUES (NOW(), NOW(), ?, ?)
    `;
  vParams.push(params.alarm_id, params.user_wallet_id);
  return await conn.query(vQuery, vParams);
};

// 패치 할 내용이 없음
const etPatchIscheck = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE alarm_send SET
        is_check = ?,
        updated_at = NOW()
        WHERE send_id = ?
        `;

  vParams.push(params.is_check, params.send_id);

  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etDetailIsExist,
  etSave,
  etPatchIscheck,
};
