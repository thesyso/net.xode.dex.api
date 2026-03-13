import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoSoboardFavorite from "../../models/soboards/dao.soboard.favorite";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoSoboardFavorite.etList(conn, params);
    const rowCount = await daoSoboardFavorite.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`soboardFavoriteController.acList`, error?.message || error, "error");
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
    const reRes = await daoSoboardFavorite.etDetail(conn, id);
    
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`soboardFavoriteController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoSoboardFavorite.etSave(conn, params);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the favorite record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.length || 0,
      };
    }
  } catch (error: any) {
    moMessage(`soboardFavoriteController.acSave`, error?.message || error, "error");
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
    const reRes = await daoSoboardFavorite.etRemove(conn, id);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove the favorite record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`soboardFavoriteController.acRemove`, error?.message || error, "error");
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