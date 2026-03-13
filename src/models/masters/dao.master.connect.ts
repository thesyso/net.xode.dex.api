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

  var srBeginDate = new Date(!isNaN(params.srBeginDate) ? params.srBeginDate : null);
  var srEndDate = new Date(!isNaN(params.srEndDate) ? params.srEndDate : null);

  var srMasterId = params.srMasterId ? params.srMasterId : "";

  var vQuery = `
    SELECT SQL_CALC_FOUND_ROWS 
      mc.*
    FROM master_connect mc
    WHERE mc.connect_id IS NOT NULL
  `;

  if(srMasterId){
    vParams.push(srMasterId);
    vQuery = vQuery + ` AND mc.master_id = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND mc.connected_ip LIKE ?`;
        vParams.push(srTxt);
        break;
    }
  }

    // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND mc.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND mc.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY mc.connect_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};

const etDetail = async (conn: any, id: number) => {
  var vParams = new Array();
  var vQuery = `
    SELECT 
      mc.*
    FROM master_connect mc
    WHERE mc.connect_id = ?
  `;
  vParams.push(id);

  return await conn.query(vQuery, vParams);
};

const etSave = async (conn: any, params: any) => {
  var vParams = new Array();
  var vQuery = `
    INSERT INTO master_connect (
      memo,
      connected_ip,
      connected_at,
      master_id
    ) VALUES (?, ?, NOW(), ?)
  `;

  vParams.push(params.memo, params.connected_ip, params.master_id);
  return await conn.query(vQuery, vParams);
};

const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();
  var vQuery = `
    DELETE FROM master_connect
    WHERE connect_id = ?
  `;
  vParams.push(id);
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etRemove,
};