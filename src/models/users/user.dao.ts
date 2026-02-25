export class daoUser {
  constructor() {}
  async etCount(conn: any, params: any) {
    var vQuery = `SELECT COUNT(*) as count FROM user WHERE is_use = 1`;
    return await conn.query(vQuery);
  }
  async etList(conn: any, params: any) {}
  // detail
  async etDetail(conn: any, user_id: number) {}
  // create
  async etSave(conn: any, params: any) {}
  // update
  async etChange(conn: any, params: any) {}
  // update
  async etPatch(conn: any, params: any) {}
  // delete
  async etRemove(conn: any, params: any) {}
}