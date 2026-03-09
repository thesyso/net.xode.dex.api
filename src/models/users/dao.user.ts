  const etCount = async (conn: any, params: any) => {
    var vQuery = `SELECT FOUND_ROWS() as count`;
    return await conn.query(vQuery);
  }
  const etList = async (conn: any, params: any) => {}
  // 상세조회
  const etDetail = async (conn: any, user_id: number) => {}
  // create
  const etSave = async (conn: any, params: any) => {}
  // 수정
  const etChange = async (conn: any, params: any) => {}
  // 수정
  const etPatch = async (conn: any, params: any) => {}
  // delete
  const etRemove = async (conn: any, params: any) => {}