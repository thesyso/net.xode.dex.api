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
  var srBoardId = params.srBoardId ? params.srBoardId : 0;

  // var cago = params.cago ? params.cago : "";
  // var srStatus = params.srStatus ? params.srStatus : "1";
  var srUsed = params.srUsed ? params.srUsed : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          sc.*
        FROM soboard_content sc
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE sc.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE 1 = 1`;
  }

  if (srBoardId) {
    vParams.push(srBoardId);
    vQuery = vQuery + ` AND sc.soboard_id = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND sc.contents LIKE ?`;
        break;
    }
  }

  // search date
  if (srBeginDate) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND sc.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (srEndDate) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND sc.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY sc.content_id DESC `;
  
  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = [id];
  var vQuery = `
        SELECT b.*
        FROM scboard_content b
        WHERE b.content_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO scboard_content (
    sort,
    contents,
    is_use,
    created_at,
    soboard_id
  ) VALUES (?, ?, ?, NOW(), ?)`;
  return await conn.query(vQuery, [
    params.sort,
    params.contents,
    params.is_use,
    params.soboard_id
  ]);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vQuery = `UPDATE scboard_content 
  SET sort = ?, contents = ?, updated_at = NOW() 
  WHERE content_id = ?`;

  return await conn.query(vQuery, [
    params.sort,
    params.contents,
    params.content_id,
  ]);
};
// 패치
const etPatchSort = async (conn: any, params: any) => {
  var vQuery = `UPDATE scboard_content SET sort = ?, updated_at = NOW() WHERE content_id = ?`;
  return await conn.query(vQuery, [params.sort, params.content_id]);
};
const etPatchSortUnShift = async (conn: any, params: any) => {
  var vQuery = `UPDATE scboard_content 
  SET sort = sort + 1, updated_at = NOW() 
  WHERE soboard_id = ? AND content_id != ? AND sort >= ?`;
  return await conn.query(vQuery, [params.sort, params.soboard_id, params.content_id, params.sort]);
};
//
const etRemove = async (conn: any, id: number) => {
  var vQuery = `UPDATE scboard_content SET is_use = 0 WHERE content_id = ? AND is_use = 1`;
  return await conn.query(vQuery, [id]);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatchSort,
  etPatchSortUnShift,
  etRemove
};
