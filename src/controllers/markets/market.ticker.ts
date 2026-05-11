import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoMarketTicker from "../../models/markets/dao.market.ticker";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarketTicker.etList(conn, params);
    const rowCount = await daoMarketTicker.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`marketTickerController.acList`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

// 상세조회
const acDetail = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarketTicker.etDetail(conn, id);
    
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`marketTickerController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoMarketTicker.etSave(conn, params);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketTickerController.acSave`, error?.message || error, "error");
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
    const reRes = await daoMarketTicker.etChange(conn, params);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketTickerController.acChange`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acPatch = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };
  const conn = await getPools();
  var reRes;
  try {
    switch (params.chmode?.toLowerCase()) {
      case "workdate":
        reRes = await daoMarketTicker.etPatchWorkDate(conn, params);
        break;
      case "marketcode":
        reRes = await daoMarketTicker.etPatchMarketCode(conn, params);
        break;
      case "exchangecode":        
        reRes = await daoMarketTicker.etPatchExchangeCode(conn, params);
        break;
      default:
        reRes = await daoMarketTicker.etPatch(conn, params);
    }
    
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketTickerController.acPatch`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    } 
  }
  return result;
};

// 삭제
const acRemove = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };
  const conn = await getPools();
  try {
    const reRes = await daoMarketTicker.etRemove(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`marketTickerController.acRemove`, error?.message || error, "error");
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
  acChange,
  acRemove
};  