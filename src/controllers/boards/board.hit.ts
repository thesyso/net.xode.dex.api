import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoBoardHit from "../../models/boards/dao.board.hit";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardHit.etList(conn, params);
    const rowCount = await daoBoardHit.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`boardHitController.acList`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardHit.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`boardHitController.acDetail`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardHit.etSave(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the board hit.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    }
  } catch (error: any) {
    moMessage(`boardHitController.acSave`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardHit.etRemove(conn, id);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove the board hit.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    }
  } catch (error: any) {
    moMessage(`boardHitController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default {
  acList,
  acDetail,
  acSave,
  acRemove,
};
