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
  var srIsConfirm = params.srIsConfirm ? params.srIsConfirm : "";
  var srIsReal = params.srIsReal ? params.srIsReal : "";
  var srIsOtp = params.srIsOtp ? params.srIsOtp : "";

  var vQuery = `
      SELECT SQL_CALC_FOUND_ROWS 
        s.*
      FROM swap s
      WHERE 1=1
    `;

  if (srIsConfirm) {
    vParams.push(srIsConfirm);
    vQuery = vQuery + ` AND s.is_confirm = ?`;
  }
  if (srIsReal) {
    vParams.push(srIsReal);
    vQuery = vQuery + ` AND s.is_real = ?`;
  }
  if (srIsOtp) {
    vParams.push(srIsOtp);
    vQuery = vQuery + ` AND s.is_otp = ?`;
  }

  // where : sr srtxt
  if (sr != 0 && srTxt.length > 0) {
    switch (true) {
      case sr == 1:
        vParams.push(srTxt);
        vQuery = vQuery + ` AND s.market_code LIKE ?`;
        break;
      case sr == 2:
        vParams.push(srTxt, srTxt);
        vQuery = vQuery + ` AND (s.address LIKE ? OR s.target_address LIKE ?)`;
        break;
    }
  }

  // search date
  if (!isNaN(srBeginDate.getTime())) {
    vParams.push(srBeginDate);
    vQuery = vQuery + ` AND s.created_at > DATE_FORMAT(?,'%Y-%m-%d')`;
  }
  if (!isNaN(srEndDate.getTime())) {
    vParams.push(srEndDate);
    vQuery =
      vQuery +
      ` AND s.created_at < DATE_ADD(DATE_FORMAT(?,'%Y-%m-%d'), INTERVAL 1 DAY)`;
  }

  vQuery = vQuery + ` ORDER BY s.swap_id DESC `;

  // paging
  vParams.push(pageBegin, pageRow);
  vQuery = vQuery + ` LIMIT ?, ? `;

  return await conn.query(vQuery, vParams);
};
// 상세조회
const etDetail = async (conn: any, user_id: number) => {
  var vParams = new Array();

  var vQuery = `
        SELECT 
          u.*
        FROM user u
        WHERE u.user_id = ?
    `;
  vParams.push(user_id);

  return await conn.query(vQuery, vParams);
};
// create
const etSave = async (conn: any, params: any) => {
  var vParams = new Array();
  var vQuery = `
        INSERT INTO user (
          wallet_address,
          wallet_message,
          signature,
          wallet_mode,
          wallet_name,
          wallet_provider,
          status,
          emailid,
          password,
          salt,
          email,
          username,
          nickname,
          nation_no,
          location,
          language,
          user_address,
          address_detail,
          zipcode,
          is_confirm,
          is_real,
          is_otp,
          connected_ip,
          connected_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  vParams.push(
    params.wallet_address,
    params.wallet_message,
    params.signature,
    params.wallet_mode,
    params.wallet_name, 
    params.wallet_provider,
    params.status,
    params.emailid,
    params.password,
    params.salt,
    params.email,
    params.username,
    params.nickname,
    params.nation_no,
    params.location,
    params.language,
    params.user_address,
    params.address_detail,
    params.zipcode,
    params.is_confirm,
    params.is_real,
    params.is_otp,
    params.connected_ip,
    params.connected_at,
  );
  return await conn.query(vQuery, vParams);
};
// 수정
const etChange = async (conn: any, params: any) => {};
// 수정
const etPatch = async (conn: any, params: any) => {};
// delete
const etRemove = async (conn: any, params: any) => {};

export default {
  etCount,
  etList,
  etDetail,
  etSave,
  etChange,
  etPatch,
  etRemove,
};
