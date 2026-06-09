import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoPool from "../../models/pools/dao.pool";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoPool.etList(conn, params);
    const rowCount = await daoPool.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`poolController.acList`, error?.message || error, "error");
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
    const reRes = await daoPool.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`poolController.acDetail`, error?.message || error, "error");
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

  if (
    !params.market_code ||
    !params.target_market_code ||
    !params.protocol ||
    !params.fee_rate
  ) {
    result = {
      success: false,
      message:
        "Market code, target market code, protocol, and fee rate are required.",
    };
    return result;
  }

  const conn = await getPools();

  try {
    // 마켓코드와 교환코드와 동일한 수수료
    const reExistRes = await daoPool.etIsExist(conn, params);
    if (reExistRes && reExistRes.length > 0) {
      result = {
        success: false,
        message:
          "A pool with the same market code, target market code, protocol, and fee rate already exists.",
      };
      return result;
    }

    const reRes = await daoPool.etSave(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the pool record. Please try again.",
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
    moMessage(`poolController.acSave`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoPool.etChange(conn, params);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to change the pool record. Please try again.",
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
    moMessage(`poolController.acChange`, error?.message || error, "error");
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
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    var reRes;
    switch (params.chmode.toLowerCase()) {
      case "trade":
        reRes = await daoPool.etPatchTrade(conn, params);
        break;
    }

    if (reRes && reRes.affectedRows > 0) {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    } else {
      result = {
        success: false,
        message:
          "no data was updated. Please check the provided information and try again.",
      };
    }
  } catch (error: any) {
    moMessage(`poolController.acPatch`, error?.message || error, "error");
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
    const reRes = await daoPool.etRemove(conn, id);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove the pool record. Please try again.",
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
    moMessage(`poolController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default { acList, acDetail, acSave, acChange, acPatch, acRemove };
