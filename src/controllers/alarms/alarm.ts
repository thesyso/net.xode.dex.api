import getPools from "../../libs/db.ins.js";

import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import daoAlarm from "../../models/alarms/dao.alarm.js";
import daoBaseLanguage from "../../models/bases/dao.base.language.js";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  
  try {
    conn = await getPools();

    const rows = await daoAlarm.etList(conn, params);
    const rowCount = await daoAlarm.etCount(conn);

    result = {
      success: true,
      message: "",
      data: rows,
      count: rowCount[0]?.count || 0,
    };

  } catch (error: any) {
    moMessage(`languageController.acList`, error?.message || error, "error", );
  } finally {
    if (conn) {
      conn.release();
    }
  }

  // default return
  return result;
};

const acDetail = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  let rowsCount = 0;

  try{
    conn = await getPools();

    const rows = await daoAlarm.etDetail(conn, id);
    const rowCount = await daoAlarm.etCount(conn);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = rowCount[0]?.count || 0;

  }catch (error: any) {
    moMessage(`languageController.acDetail`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }

  // default return
  return result;
};

const acSave = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;

  try {
    conn = await getPools();

    // Check if the specified alarm exists before attempting to save
    const row = await daoAlarm.etDetail(conn, params.alarm_id);
    if (row && row.length > 0) {
      result.message = "The specified alarm already exists.";
      return result;
    }

    const rows = await daoAlarm.etSave(conn, params);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = conn.affectedRows || 0;

  } catch (error: any) {
    moMessage(
      `alarmController.acSave`,
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

const acChange = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;

  try {
    conn = await getPools();

    // Check if the specified alarm exists before attempting to delete
    const row = await daoAlarm.etDetail(conn, params.alarm_id);
    if (!row || row.length === 0) {
      result.message = "The specified alarm does not exist.";
      return result;
    }
    
    const rows = await daoAlarm.etChange(conn, params);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = conn.affectedRows || 0;

  } catch (error: any) {
    moMessage(
      `alarmController.acChange`,
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

const acPatchStatus = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;

  try {
    conn = await getPools();
    // Check if the specified alarm exists before attempting to delete
    const row = await daoAlarm.etDetail(conn, params.alarm_id);
    if (!row || row.length === 0) {
      result.message = "The specified alarm does not exist.";
      return result;
    }

    const rows = await daoAlarm.etPatchStatus(conn, params);
    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = conn.affectedRows || 0;
  } catch (error: any) {
    moMessage(
      `alarmController.acPatchStatus`,
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
}

const acRemove = async (id: number) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  try {
    conn = await getPools();

    // Check if the specified alarm exists before attempting to delete
    const row = await daoAlarm.etDetail(conn, id);
    if (!row || row.length === 0) {
      result.message = "The specified alarm does not exist.";
      return result;
    }

    const rows = await daoAlarm.etRemove(conn, id);

    if (rows.affectedRows > 0) {
      result.success = true;
      result.message = "Data removed successfully.";
    } else {
      result.message = "Failed to remove data.";
    }

  } catch (error: any) {
    moMessage(
      `languageController.acRemove`,
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

export default {
  acList,
  acDetail,
  acSave,
  acChange,
  acPatchStatus,
  acRemove,
};
