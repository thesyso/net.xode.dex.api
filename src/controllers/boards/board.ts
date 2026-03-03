import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";
import daoBoard from "../../models/boards/dao.board";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  let rowsCount = 0;

  try {
    /// get connection
    const conn = await getPools();

    /// query
    const reRes = await daoBoard.etList(conn, params);
    const rowCount = await daoBoard.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`boardController.acList`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acDetail = async (uid: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  let rowsCount = 0;

  try {
    const conn = await getPools();

    const reRes = await daoBoard.etDetail(conn, uid);
    const rowCount = await daoBoard.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`boardController.acDetail`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acSave = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  try {
    const conn = await getPools();

    const reRes = await daoBoard.etSave(conn, params);
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "Data saved successfully.";
    } else {
      result.message = "Failed to save data.";
    }
  } catch (error: any) {
    moMessage(`boardController.acSave`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acChange = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  try {
    const conn = await getPools();

    const row = await daoBoard.etDetail(conn, params.uid);
    if (!row || row.length === 0) {
      result.message = "The specified board does not exist.";
      return result;
    }
    
    const reRes = await daoBoard.etChange(conn, params);
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "Data updated successfully.";
    } else {
      result.message = "Failed to update data.";
    }
  } catch (error: any) {
    moMessage(`boardController.acChange`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acRemove = async (uid: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  try {
    const conn = await getPools();

    const row = await daoBoard.etDetail(conn, uid);
    if (!row || row.length === 0) {
      result.message = "The specified board does not exist.";
      return result;
    }

    const reRes = await daoBoard.etRemove(conn, uid);
    
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "Data removed successfully.";
    } else {
      result.message = "Failed to remove data.";
    }
  } catch (error: any) {
    moMessage(`boardController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};
