import getPools from "../../libs/db.ins.js";

import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import daoAsset from "../../models/assets/dao.asset.js";
import daoBaseLanguage from "../../models/bases/dao.base.language.js";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  
  try {
    conn = await getPools();

    const rows = await daoAsset.etList(conn, params);
    const rowCount = await daoAsset.etCount(conn);

    result = {
      success: true,
      message: "",
      data: rows,
      count: rowCount[0]?.count || 0,
    };

  } catch (error: any) {
    moMessage(`assetController.acList`, error?.message || error, "error", );
  } finally {
    if (conn) {
      conn.release();
    }
  }

  // default return
  return result;
};

const acDetail = async (asset_id: string, asset_node: string) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  let rowsCount = 0;

  try{
    conn = await getPools();

    const rows = await daoAsset.etDetail(conn, asset_id, asset_node);
    const rowCount = await daoAsset.etCount(conn);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = rowCount[0]?.count || 0;

  }catch (error: any) {
    moMessage(`assetController.acDetail`, error?.message || error, "error");
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

    // Check if the specified asset exists before attempting to save
    const row = await daoAsset.etDetail(conn, params.asset_id, params.asset_node);
    if (row && row.length > 0) {
      result.message = "The specified asset already exists.";
      return result;
    }

    const rows = await daoAsset.etSave(conn, params);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = conn.affectedRows || 0;

  } catch (error: any) {
    moMessage(
      `assetController.acSave`,
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

    // Check if the specified asset exists before attempting to change
    const row = await daoAsset.etDetail(conn, params.asset_id, params.asset_node);
    if (!row || row.length === 0) {
      result.message = "The specified asset does not exist.";
      return result;
    }
    
    const rows = await daoAsset.etChange(conn, params);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = conn.affectedRows || 0;

  } catch (error: any) {
    moMessage(
      `assetController.acChange`,
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
    // Check if the specified asset exists before attempting to patch status
    const row = await daoAsset.etDetail(conn, params.asset_id, params.asset_node);
    if (!row || row.length === 0) {
      result.message = "The specified asset does not exist.";
      return result;
    }

    const rows = await daoAsset.etPatchStatus(conn, params);

    result.success = true;
    result.message = "";
    result.data = rows;
    result.count = conn.affectedRows || 0;
  } catch (error: any) {
    moMessage(
      `assetController.acPatchStatus`,
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

const acRemove = async (asset_id: string, asset_node: string) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  try {
    conn = await getPools();

    // Check if the specified asset exists before attempting to delete
    const row = await daoAsset.etDetail(conn, asset_id, asset_node);
    if (!row || row.length === 0) {
      result.message = "The specified asset does not exist.";
      return result;
    }

    const rows = await daoAsset.etRemove(conn, asset_id, asset_node);

    if (rows.affectedRows > 0) {
      result.success = true;
      result.message = "Data removed successfully.";
    } else {
      result.message = "Failed to remove data.";
    }

  } catch (error: any) {
    moMessage(
      `assetController.acRemove`,
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
