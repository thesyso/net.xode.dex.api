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
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          b.*
        FROM board b
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE b.used = ?`;
  } else {
    vQuery = vQuery + ` WHERE b.board_id IS NOT NULL`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND b.subject LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND b.contents LIKE ?`;
        break;
      case sr == 3:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND b.writer LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND b.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND b.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  // search cago
  if (cago) {
    vParams.push(cago);
    vQuery = vQuery + ` AND b.cago = ?`;
  }

  // search status
  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` AND b.status = ?`;
  }

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;
  vQuery = vQuery + ` ORDER BY b.board_id DESC `;
  console.log(vQuery, vParams);
  return await conn.query(vQuery, vParams);
};

// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = [id];
  var vQuery = `
        SELECT b.*
        FROM board b
        WHERE b.board_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO board (
    cago, 
    depth, 
    status, 
    writer, 
    subject, 
    contents,
    created_at,
    updated_at,
    user_id, 
    wallet_id
  ) VALUES (?, ?, 1, ?, ?, ?, NOW(), NOW(), ?, ?)`;
  return await conn.query(vQuery, [
    params.cago,
    params.depth,
    params.writer,
    params.subject,
    params.contents,
    params.user_id,
    params.wallet_id,
  ]);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vQuery = `UPDATE board SET subject = ?, contents = ?, updated_at = NOW() WHERE board_id = ? AND status = 1`;
  return await conn.query(vQuery, [
    params.subject,
    params.contents,
    params.board_id,
  ]);
};

const etPatchCago = async (conn: any, params: any) => {
  var vQuery = `UPDATE board SET cago = ?, updated_at = NOW() WHERE board_id = ? AND status = 1`;
  return await conn.query(vQuery, [params.cago, params.board_id]);
};

const etPatchStatus = async (conn: any, params: any) => {
  var vQuery = `UPDATE board SET status = ?, updated_at = NOW() WHERE board_id = ?`;
  return await conn.query(vQuery, [params.status, params.board_id]);
};

// delete
const etRemove = async (conn: any, id: number) => {
  var vQuery = `UPDATE board SET status = 0 WHERE board_id = ? AND status = 1`;
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
