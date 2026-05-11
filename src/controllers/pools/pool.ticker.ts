import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoPoolTicker from "../../models/pools/dao.pool.ticker";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoPoolTicker.etList(conn, params);
    const rowCount = await daoPoolTicker.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`poolTickerController.acList`, error?.message || error, "error");
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
    const reRes = await daoPoolTicker.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(
      `poolTickerController.acDetail`,
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

// 저장
const acSave = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoPoolTicker.etSave(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the ticker record. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`poolTickerController.acSave`, error?.message || error, "error");
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
    const reRes = await daoPoolTicker.etChange(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to change the ticker record. Please try again.",
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
      `poolTickerController.acChange`,
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

const acPatchPriceEnd = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoPoolTicker.etPatchPriceEnd(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message:
          "Failed to update price_end_24. Please check the ticker_id and try again.",
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
      `poolTickerController.acPatchPriceEnd`,
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

const acRemove = async (id: number) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoPoolTicker.etRemove(conn, id);

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove the ticker record. Please try again.",
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
      `poolTickerController.acRemove`,
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
  acChange,
  acRemove,
};
