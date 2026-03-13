import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoMarketI18n from "../../models/markets/dao.market.i18n";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarketI18n.etList(conn, params);
    const rowCount = await daoMarketI18n.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`marketI18nController.acList`, error?.message || error, "error");
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
    const reRes = await daoMarketI18n.etDetail(conn, id);

    result = {
      success: true,  
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`marketI18nController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoMarketI18n.etSave(conn, params);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketI18nController.acSave`, error?.message || error, "error");
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

  const conn = await getPools();

  try {
    const reRes = await daoMarketI18n.etChange(conn, params);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketI18nController.acChange`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    } 
  }
  return result;
};

const acRemove = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoMarketI18n.etRemove(conn, params);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketI18nController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default { acList, acDetail, acSave, acChange, acRemove };
