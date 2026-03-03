const etCount = async (conn: any) => {
  var vQuery = `SELECT FOUND_ROWS() as count`;
  return await conn.query(vQuery);
};

const etList = async (conn: any, params: any) => {
  console.log("daoBoard etList", params);
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
    vQuery = vQuery + ` WHERE b.board_uid IS NOT NULL`;
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
    vQuery = vQuery + ` AND b.createdate > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND b.createdate < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;
  vQuery = vQuery + ` ORDER BY b.board_id DESC `;
  console.log(vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// detail
const etDetail = async (conn: any, board_id: number) => {
  var vParams = [board_id];
  var vQuery = `
        SELECT b.*
        FROM board b
        WHERE b.board_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO board (cago, depth, status, writer, subject, contents, created_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  return await conn.query(vQuery, [
    params.cago,
    params.depth,
    params.status,
    params.writer,
    params.subject,
    params.contents,
    params.created_user_id,
  ]);
};
// update
const etChange = async (conn: any, params: any) => {
  var vQuery = `UPDATE board SET subject = ?, contents = ?, updated_at = NOW() WHERE board_id = ? AND status = 1`;
  return await conn.query(vQuery, [
    params.subject,
    params.contents,
    params.board_id
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
const etRemove = async (conn: any, uid: number) => {
  var vQuery = `UPDATE board SET status = 0 WHERE board_id = ? AND status = 1`;
  return await conn.query(vQuery, [uid]);
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
}