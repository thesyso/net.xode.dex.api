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
  var srStatus = params.srStatus ? params.srStatus : "";
  var srNation = params.srNation ? params.srNation : "";
  var srLocation = params.srLocation ? params.srLocation : "";

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          m.*
        FROM master m
        WHERE m.master_id IS NOT NULL
    `;

  if (srStatus) {
    vParams.push(srStatus);
    vQuery = vQuery + ` AND m.status = ?`;
  }

  if (srNation) {
    vParams.push(srNation);
    vQuery = vQuery + ` AND m.nation = ?`;
  }

  if (srLocation) {
    vParams.push(srLocation);
    vQuery = vQuery + ` AND m.location = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND m.email LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND (m.mastername LIKE ? OR m.nickname LIKE ?)`;
        break;
      case sr == 3:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND m.phone LIKE ?`;
        break;
      case sr == 4:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND m.connected_ip LIKE ?`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND m.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND m.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY m.language_code ASC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          m.*
        FROM master m
        WHERE m.master_id = ?
    `;
  vParams.push(id);

  // console.log("daoBaseLanguage etDetail vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
};
const etDetailInEmailID = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        SELECT SQL_CALC_FOUND_ROWS 
          m.*
        FROM master m
        WHERE m.emailid = ?
    `;
  vParams.push(params.emailid);

  // console.log("daoBaseLanguage etDetailInEmailID vQuery", vQuery, vParams);
  return await conn.query(vQuery, vParams);
}


// 등록
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();

  console.log("daoMaster etSave params", params);

  var vQuery = `
        INSERT INTO master (
          status,
          authority,
          emailid,
          password,
          salt,
          email,
          mastername,
          nickname,
          nation_no,
          phone,
          nation,
          location,
          language,
          address,
          address_detail,
          zipcode,
          connected_ip,
          connected_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
  vParams.push(
    params.status,
    params.authority,
    params.emailid,
    params.password,
    params.salt,
    params.email,
    params.mastername,
    params.nickname,
    params.nation_no,
    params.phone,
    params.nation,
    params.location,
    params.language,
    params.address,
    params.address_detail,
    params.zipcode,
    params.connected_ip
  );
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
        UPDATE master SET
          nation_no = ?,
          phone = ?,
          nation = ?,
          location = ?,
          language = ?,
          address = ?,
          address_detail = ?,
          zipcode = ?
        WHERE master_id = ?
    `;
  vParams.push(
    params.nation_no,
    params.phone,
    params.nation,
    params.location,
    params.language,
    params.address,
    params.address_detail,
    params.zipcode,
    params.master_id,
  );

  return await conn.query(vQuery, vParams);
};
// 부분 패치
const etPatchStatus = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE master SET
    status = ?
    WHERE master_id = ?
    AND status != 9
    `;

  vParams.push(params.status, params.master_id);

  return await conn.query(vQuery, vParams);
};
const etPatchAuthority = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE master SET
    authority = ?
    WHERE master_id = ?
    `;

  vParams.push(params.authority, params.master_id);

  return await conn.query(vQuery, vParams);
};
const etPatchPassword = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE master SET
    password = ?,
    salt = ?
    WHERE master_id = ?
    `;

  vParams.push(params.password, params.salt, params.master_id);

  return await conn.query(vQuery, vParams);
};
const etPatchEmail = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE master SET
    email = ?
    WHERE master_id = ?
    `;

  vParams.push(params.email, params.master_id);

  return await conn.query(vQuery, vParams);
};
const etPatchNickName = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE master SET
    nickname = ?
    WHERE master_id = ?
    `;

  vParams.push(params.nickname, params.master_id);

  return await conn.query(vQuery, vParams);
};
const etPatchMasterName = async (conn: any, params: any) => {
  var vParams = new Array();

  var vQuery = `
    UPDATE master SET
    mastername = ?
    WHERE master_id = ?
    `;

  vParams.push(params.mastername, params.master_id);

  return await conn.query(vQuery, vParams);
};

// 삭제
const etRemove = async (conn: any, id: number) => {
  var vParams = new Array();

  vParams.push(id);
  var vQuery = `
        UPDATE master
        SET status = 9
        WHERE master_id = ?
  `;
  return await conn.query(vQuery, vParams);
};

export default {
  etCount,
  etList,
  etDetail,
  etDetailInEmailID,
  etSave,
  etChange,
  etPatchStatus,
  etPatchAuthority,
  etPatchPassword,
  etPatchEmail,
  etPatchNickName,
  etPatchMasterName,
  etRemove,
};