import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoWalletTransaction from "../../models/wallets/dao.wallet.transaction";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {
    const reRes = await daoWalletTransaction.etList(conn, params);
    const rowCount = await daoWalletTransaction.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`walletTransactionController.acList`, error?.message || error, "error");
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
    const reRes = await daoWalletTransaction.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`walletTransactionController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoWalletTransaction.etSave(conn, params);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save wallet transaction data. Please try again.",
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
    moMessage(`walletTransactionController.acSave`, error?.message || error, "error");
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
    var reRes;
    switch(params?.chmode.toLowerCase()) {
      case "status":
        reRes = await daoWalletTransaction.etPatchStatus(conn, params);
    }
    
    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update wallet transaction data. Please try again.",
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
    moMessage(`walletTransactionController.acPatch`, error?.message || error, "error");
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
    const reRes = await daoWalletTransaction.etRemove(conn, id);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to delete the wallet transaction. Please try again.",
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
    moMessage(`walletTransactionController.acRemove`, error?.message || error, "error");
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
  acPatch,
  acRemove,
};
