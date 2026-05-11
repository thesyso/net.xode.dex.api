import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoWallet from "../../models/wallets/dao.wallet";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoWallet.etList(conn, params);
    const rowCount = await daoWallet.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`walletController.acList`, error?.message || error, "error");
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
    const reRes = await daoWallet.etDetail(conn, id);
    result = {
      success: true,
      message: "",  
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`walletController.acDetail`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

// 상세조회 주소
const acDetailCoinAddress = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoWallet.etDetailCoinAddress(conn, params);
    result = {
      success: true,
      message: "",  
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`walletController.acDetailCoinAddress`, error?.message || error, "error");
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
    const reRes = await daoWallet.etSave(conn, params);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the wallet. Please try again.",
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
    moMessage(`walletController.acSave`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

// 변경
const acChange = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoWallet.etChange(conn, params);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update the wallet. Please try again.",
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
    moMessage(`walletController.acChange`, error?.message || error, "error");
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
    const reRes = await daoWallet.etRemove(conn, id);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to delete the wallet. Please try again.",
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
    moMessage(`walletController.acRemove`, error?.message || error, "error");
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
  acDetailCoinAddress,
  acSave,
  acChange,
  acRemove,
};
