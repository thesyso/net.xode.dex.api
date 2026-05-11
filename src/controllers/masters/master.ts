import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoMaster from "../../models/masters/dao.master";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();
  try {
    const reRes = await daoMaster.etList(conn, params);
    const rowCount = await daoMaster.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`masterController.acList`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();
  try {
    const reRes = await daoMaster.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`masterController.acDetail`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };
  const conn = await getPools();
  try {
    const reRes = await daoMaster.etSave(conn, params);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.affectedRows || 0,
    };
  } catch (error: any) {
    moMessage(`masterController.acSave`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };
  const conn = await getPools();
  try {
    var reRes;
    switch (params.chmode.toLowerCase()) {
      case "status":
        reRes = await daoMaster.etPatchStatus(conn, params);
        break;
      case "authority":
        reRes = await daoMaster.etPatchAuthority(conn, params);
        break;
      case "password":
        reRes = await daoMaster.etPatchPassword(conn, params);
        break;
      case "email":
        reRes = await daoMaster.etPatchEmail(conn, params);
        break;
      case "nickname":
        reRes = await daoMaster.etPatchNickName(conn, params);
        break;
      case "mastername":
        reRes = await daoMaster.etPatchMasterName(conn, params);
        break;
      default:
        reRes = { affectedRows: 0 };
        break;
    }

    if(reRes.affectedRows > 0){
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    } else {
      result.message = "Failed to update master data.";
      result.count = reRes.affectedRows || 0;
    }


  } catch (error: any) {
    moMessage(`masterController.acPatch`, error?.message || error, "error");
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
    const reRes = await daoMaster.etRemove(conn, id);
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "";
      result.data = reRes;
      result.count = reRes.affectedRows || 0;
    } else {
      result.message = "Failed to remove master data.";
      result.count = reRes.affectedRows || 0;
    } 
  } catch (error: any) {
    moMessage(`masterController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default { acList, acDetail, acSave, acPatch, acRemove };
