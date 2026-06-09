import { getPools } from "../../libs/mongodb.ins.js";
import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import daoAsset from "../../models/nodes/dao.asset.js";

const acList = async (params: any) => {
  // console.log("assetController.acList called with params:", params);
  
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn = null;
  try {
    conn = await getPools();
    const { rows, count } = await daoAsset.etList(conn, params);
    result = {
      success: true,
      message: "Data retrieved successfully.",
      data: rows,
      count: count,
    };
  } catch (error: any) {
    moMessage(`assetController.acList`, error?.message || error, "error");
    result.message = error?.message || "Failed to connect to MongoDB.";
  }
  return result;
};

const acRemove = async (id: string) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn = null;
  try {
    conn = await getPools();
    await daoAsset.etRemove(conn, id);  
    result = {
      success: true,
      message: "Asset removed successfully."
    };
  } catch (error: any) {
    moMessage(`assetController.acRemove`, error?.message || error, "error");
    result.message = error?.message || "Failed to connect to MongoDB.";
  }
  return result;
};

export default {
  acList,
  acRemove,
};
    