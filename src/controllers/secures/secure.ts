import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoSecure from "../../models/secures/dao.secure";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    /// query
    const reRes = await daoSecure.etList(conn, params);
    const rowCount = await daoSecure.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`secureController.acList`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSecure.etDetail(conn, id);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`secureController.acDetail`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSecure.etSave(conn, params);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the secure record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`secureController.acSave`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acPatchCommit = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSecure.etPatchCommit(conn, params);
    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to patch commit the secure record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`secureController.acPatchCommit`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try { 
    const reRes = await daoSecure.etRemove(conn, id);
    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove the secure record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`secureController.acRemove`, error?.message || error, "error");
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
  acPatchCommit,
  acRemove,
};