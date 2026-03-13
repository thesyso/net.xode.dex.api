import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoBoardFile from "../../models/boards/dao.board.file";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardFile.etList(conn, params);
    const rowCount = await daoBoardFile.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`boardFileController.acList`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acDetail = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardFile.etDetail(conn, id);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };

  } catch (error: any) {
    moMessage(`boardFileController.acDetail`, error?.message || error, "error");
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

  const conn = await getPools();
  try {
    const reRes = await daoBoardFile.etSave(conn, params);
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "";
      result.data = reRes;
      result.count = reRes.affectedRows || 0;
    } else {
      result.message = "Failed to save the board file.";
    }
  } catch (error: any) {
    moMessage(`boardFileController.acSave`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acRemove = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoBoardFile.etRemove(conn, id);
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "";
      result.data = reRes;
      result.count = reRes.affectedRows || 0;
    } else {
      result.message = "Failed to remove the board file.";
    }
  } catch (error: any) {
    moMessage(`boardFileController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};