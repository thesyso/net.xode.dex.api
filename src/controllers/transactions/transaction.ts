import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoTransaction from "../../models/transactions/dao.transaction";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoTransaction.etList(conn, params);
    const rowCount = await daoTransaction.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`transactionController.acList`, error?.message || error, "error");
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
    const reRes = await daoTransaction.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`transactionController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoTransaction.etSave(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save transaction data. Please try again.",
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
    moMessage(`transactionController.acSave`, error?.message || error, "error");  
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

// 수정
// 패치
const acPatch = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try { 
    var reRes;

    switch(params?.chmode.toLowerCase()) {
      case "status":
        reRes = await daoTransaction.etPatchStatus(conn, params);
        break;
    }

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update transaction data. Please try again.",
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
    moMessage(`transactionController.acPatch`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};