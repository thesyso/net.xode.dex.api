import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoBoardImage from "../../models/boards/dao.board.image";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardImage.etList(conn, params);
    const rowCount = await daoBoardImage.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`boardImageController.acList`, error?.message || error, "error");
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
    const reRes = await daoBoardImage.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`boardImageController.acDetail`, error?.message || error, "error");
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
    
    const reRes = await daoBoardImage.etSave(conn, params);
    if (reRes.affectedRows > 0) {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    } else {
        result.message = "Failed to save the board image.";
    }
  } catch (error: any) {
    moMessage(`boardImageController.acSave`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    } 
  } 
  return result;
}

const acRemove = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoBoardImage.etRemove(conn, id);
    if (reRes.affectedRows > 0) {
      result = {  
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    } else {
      result.message = "Failed to remove the board image.";
    }
  } catch (error: any) {
    moMessage(`boardImageController.acRemove`, error?.message || error, "error");
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