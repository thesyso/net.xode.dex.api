import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoMarket from "../../models/markets/dao.market";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarket.etList(conn, params);
    const rowCount = await daoMarket.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`marketController.acList`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};
// 상세조회
const acDetail = async (code: string) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarket.etDetail(conn, code);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`marketController.acDetail`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};
// 저장
const acSave = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoMarket.etSave(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result.message = "Failed to save market data.";
    } else {
      result.success = true;
      result.message = "";
    }
  } catch (error: any) {
    moMessage(`marketController.acSave`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    } 
  }
  return result;
};
// 수정
const acChange = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarket.etChange(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result.message = "Failed to update market data.";
    } else {
      result.success = true;
      result.message = "";
    }
  } catch (error: any) {
    moMessage(`marketController.acChange`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};
// 패치
const acPatch = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    // mode 에 따라 분기하여 설정해야 하나 Gas 만 패치 함으로 고정
    const reRes = await daoMarket.etPatchGas(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result.message = "Failed to update market gas data.";
    } else {
      result.success = true;
      result.message = "";
    }
  } catch (error: any) {
    moMessage(`marketController.acPatchGas`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

// 삭제
const acRemove = async (code: string) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoMarket.etRemove(conn, code);
    if (!reRes || reRes.affectedRows === 0) {
      result.message = "Failed to remove market data.";
    } else {
      result.success = true;
      result.message = "";
    }
  } catch (error: any) {
    moMessage(`marketController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default{
  acList,
  acDetail,
  acSave,
  acChange,
  acPatchGas,
  acRemove,
};