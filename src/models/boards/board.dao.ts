export class daoBoard {
  constructor() {
    //
  }

  async etCount(conn: any) {
    var vQuery = `SELECT FOUND_ROWS() as count`;
    return await conn.query(vQuery);
  }

  async etList(conn: any, params: any) {
    var pageRow = params.pageRow ? params.pageRow : 10;
    var pageBegin = params.page ? (params.page - 1) * pageRow : 0;

    var vParams = new Array();

    var sr = params.sr ? params.sr : 0;
    var srTxt = params.srTxt?.length > 0 ? `%` + params.srTxt + `%` : "";

    var srBeginDate = new Date(
      !isNaN(params.srBeginDate) ? params.srBeginDate : "",
    );
    var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : "");

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
    vQuery = vQuery + ` ORDER BY b.board_uid DESC `;

    return await conn.query(vQuery, vParams);
  }
  // detail
  async etDetail(conn: any, board_id: number) {
    var vParams = [board_id];
    var vQuery = `
        SELECT b.*
        FROM board b
        WHERE b.board_uid = ?
    `;

    return await conn.query(vQuery, vParams);
  }
  // create
  async etCreate(conn: any, params: any) {
    var vQuery = `INSERT INTO board (cago, depth, writer, subject, contents, created_user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    return await conn.query(vQuery, [
      params.cago,
      params.depth,
      params.writer,
      params.subject,
      params.contents,
      params.created_user_id,
    ]);
  }
  // update
  async etUpdate(conn: any, params: any) {
    var vQuery = `UPDATE board SET cago = ?, depth = ?, writer = ?, subject = ?, contents = ?, updated_user_id = ? WHERE board_id = ? AND is_use = 1`;
    return await conn.query(vQuery, [
      params.cago,
      params.depth,
      params.writer,
      params.subject,
      params.contents,
      params.updated_user_id,
      params.board_id,
    ]);
  }
  // delete
  async etDelete(conn: any, params: any) {
    var vQuery = `UPDATE board SET is_use = 0, updated_user_id = ? WHERE board_id = ? AND is_use = 1`;
    return await conn.query(vQuery, [params.updated_user_id, params.board_id]);
  }
}
