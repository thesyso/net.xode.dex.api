import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.interface";
import { moMessage } from "../../libs/modules/message";

import daoSoboard from "../../models/soboards/dao.soboard";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSoboard.etList(conn, params);
    const rowCount = await daoSoboard.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`soboardController.acList`, error?.message || error, "error");
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
    const reRes = await daoSoboard.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`soboardController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoSoboard.etSave(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save the board. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`soboardController.acSave`, error?.message || error, "error");
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
    const reRes = await daoSoboard.etChange(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update the board. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
      };
    }
  } catch (error: any) {
    moMessage(`soboardController.acChange`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

const acPatchCago = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSoboard.etPatchCago(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update the board category. Please try again.",
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
      `soboardController.acPatchCago`,
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

const acPatchStatus = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  const conn = await getPools();

  try {
    const reRes = await daoSoboard.etPatchStatus(conn, params);
    result = {
      success: true,
      message: "",
      data: reRes,
    };
  } catch (error: any) {
    moMessage(
      `soboardController.acPatchStatus`,
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
    const reRes = await daoSoboard.etRemove(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
    };
  } catch (error: any) {
    moMessage(`soboardController.acRemove`, error?.message || error, "error");
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
  acPatchCago,
  acPatchStatus,
  acRemove,
};
