import { getPools } from "../../libs/mongodb.ins.js";
import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import daoBlock from "../../models/nodes/dao.block.js";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn = null;
  try {
    conn = await getPools();
    const { rows, count } = await daoBlock.etList(conn, params);
    result = {
      success: true,
      message: "Data retrieved successfully.",
      data: rows,
      count: count,
    };
  } catch (error: any) {
    moMessage(`blockController.acList`, error?.message || error, "error");
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
    await daoBlock.etRemove(conn, id);  
    result = {
      success: true,
      message: "Block removed successfully."
    };
  } catch (error: any) {
    moMessage(`blockController.acRemove`, error?.message || error, "error");
    result.message = error?.message || "Failed to connect to MongoDB.";
  }
  return result;
};

export default {
  acList,
  acRemove,
};
    