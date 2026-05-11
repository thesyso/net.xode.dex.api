import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoSoboardHit from "../../models/soboards/dao.soboard.hit";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSoboardHit.etList(conn, params);
    const rowCount = await daoSoboardHit.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`soboardHitController.acList`, error?.message || error, "error");
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
    const reRes = await daoSoboardHit.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(
      `soboardHitController.acDetail`,
      error?.message || error,
      "error",
    );
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
    const reRes = await daoSoboardHit.etSave(conn, params);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the hit record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`soboardHitController.acSave`, error?.message || error, "error");
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
    const reRes = await daoSoboardHit.etRemove(conn, id);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove the hit record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(
      `soboardHitController.acRemove`,
      error?.message || error,
      "error",
    );
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
