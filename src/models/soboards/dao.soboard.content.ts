const etCount = async (conn: any, params: any) => {
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
          sc.*
        FROM soboard_contents sc
    `;

  if (srUsed) {
    vParams.push(srUsed);
    vQuery = vQuery + ` WHERE sc.is_use = ?`;
  } else {
    vQuery = vQuery + ` WHERE sc.contents_id IS NOT NULL`;
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

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;
  vQuery = vQuery + ` ORDER BY sc.contents_id DESC `;
  console.log(vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = [id];
  var vQuery = `
        SELECT b.*
        FROM scboard_contents b
        WHERE b.contents_id = ?
    `;

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vQuery = `INSERT INTO scboard_contents (
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
  var vQuery = `UPDATE scboard_contents 
  SET sort = ?, contents = ?, updated_at = NOW() 
  WHERE contents_id = ?`;

  return await conn.query(vQuery, [
    params.sort,
    params.contents,
    params.contents_id,
  ]);
};
// 패치
const etPatchSort = async (conn: any, params: any) => {
  var vQuery = `UPDATE scboard_contents SET sort = ?, updated_at = NOW() WHERE contents_id = ?`;
  return await conn.query(vQuery, [params.sort, params.contents_id]);
};
const etPatchSortUnShift = async (conn: any, params: any) => {
  var vQuery = `UPDATE scboard_contents 
  SET sort = sort + 1, updated_at = NOW() 
  WHERE soboard_id = ? AND contents_id != ? AND sort >= ?`;
  return await conn.query(vQuery, [params.sort, params.soboard_id, params.contents_id, params.sort]);
};
// 삭제
const etRemove = async (conn: any, id: number) => {
  var vQuery = `UPDATE scboard_contents SET status = 0 WHERE contents_id = ? AND status = 1`;
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
