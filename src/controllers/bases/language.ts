import getPools from "../../libs/db.ins.js";

import { IResult } from "../../libs/interface/result.controller.js";
import { moMessage } from "../../libs/modules/message.js";

import daoBaseLanguage from "../../models/bases/base.language.dao.js";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let conn: any;
  let rowsCount = 0;

  try {
    conn = await getPools();
    const rows = await daoBaseLanguage.etList(conn, params);
    const rowCount = await daoBaseLanguage.etCount(conn);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = rowCount[0]?.count || 0;
  } catch (error: any) {
    moMessage(
      `languageController acList error`,
      error?.message || error,
      "error",
    );
  } finally {
    if (conn) {
      conn.release();
    }
  }

  // default return
  return result;
};

const acDetail = async () => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let rowsCount = 0;
  // default return
  return {
    success: true,
    message: "language detail route is working",
  };
};

const acSave = async () => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let rowsCount = 0;
  // default return
  return {
    success: true,
    message: "language save route is working",
  };
};

const acChange = async () => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let rowsCount = 0;
  // default return
  return {
    success: true,
    message: "language change route is working",
  };
};

const acPatch = async () => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let rowsCount = 0;
  // default return
  return {
    success: true,
    message: "language patch route is working",
  };
};

const acRemove = async () => {
  let result: IResult = {
    success: false,
    message:
      "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  let rowsCount = 0;
  // default return
  return {
    success: true,
    message: "language remove route is working",
  };
};

export default {
  acList,
  acDetail,
  acSave,
  acChange,
  acPatch,
  acRemove,
};
