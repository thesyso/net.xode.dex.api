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

  var cago = params.cago ? params.cago : "";
  var srStatus = params.srStatus ? params.srStatus : "1";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          sb.*
        FROM soboard sb
    `;

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` WHERE sb.status = ?`;
  } else {
    vQuery = vQuery + ` WHERE sb.soboard_id IS NOT NULL`;
  }

  if (cago) {
    vParams.push(cago);
    vQuery = vQuery + ` AND sb.cago = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND sb.subject LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND sb.contents LIKE ?`;
        break;
      case sr == 3:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND sb.writer LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND sb.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND sb.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;
  vQuery = vQuery + ` ORDER BY sb.soboard_id DESC `;
  console.log(vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = [id];
  var vQuery = `
        SELECT sb.*
        FROM soboard sb
        WHERE sb.soboard_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// 등록
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO soboard (
    cago,
    status,
    writer,
    subject,
    contents,
    contents_count,
    hits,
    created_at,
    updated_at,
    user_id,
    wallet_id
  ) VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW(), ?, ?)`;
  return await conn.query(vQuery, [
    params.cago,
    params.status,
    params.writer,
    params.subject,
    params.contents,
    params.contents_count,
    params.user_id,
    params.wallet_id
  ]);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vQuery = `UPDATE soboard SET subject = ?, contents = ?, updated_at = NOW() WHERE soboard_id = ? AND status = 1`;
  return await conn.query(vQuery, [
    params.subject,
    params.contents,
    params.soboard_id,
  ]);
};
// 패치
const etPatchCago = async (conn: any, params: any) => {
  var vQuery = `UPDATE soboard SET cago = ?, updated_at = NOW() WHERE soboard_id = ? AND status = 1`;
  return await conn.query(vQuery, [params.cago, params.soboard_id]);
};

const etPatchStatus = async (conn: any, params: any) => {
  var vQuery = `UPDATE soboard SET status = ?, updated_at = NOW() WHERE soboard_id = ? AND status != 0`;
  return await conn.query(vQuery, [params.status, params.soboard_id]);
};

// 삭제
const etRemove = async (conn: any, id: number) => {
  var vQuery = `UPDATE soboard 
  SET status = 0, updated_at = NOW()
  WHERE soboard_id = ?
  AND status = 1`;
  return await conn.query(vQuery, [id]);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchCago,
  etPatchStatus,
  etRemove,
};