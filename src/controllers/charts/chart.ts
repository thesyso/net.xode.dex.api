import { getPools } from "../../libs/mongodb.ins.js";
import { IResult } from "../../libs/interface/result.interface.js";
import { moMessage } from "../../libs/modules/message.js";

import daoChart from "../../models/charts/dao.chart.js";

const VALID_INTERVALS = ["1m", "5m", "15m", "30m", "60m", "180m", "360m", "1440m"];

// 차트 목록 조회
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator.",
  };

  params.interval = params.interval && VALID_INTERVALS.includes(params.interval) ? params.interval : "60m";
  params.chain = params.chain && params.chain.toString().trim().length > 0 ? params.chain : "XODE";

  if (!params.pairKey || params.pairKey.toString().trim().length === 0) {
    result.message = "pairKey is required. Please input pairKey.";
    return result;
  }

  // interval 유효성 검사
  if (params.interval && !VALID_INTERVALS.includes(params.interval)) {
    result.message = `Invalid interval. Allowed values: ${VALID_INTERVALS.join(", ")}`;
    return result;
  }

  try {
    const conn = await getPools();
    const { rows, count } = await daoChart.etList(conn, params);
    result = {
      success: true,
      message: "Data retrieved successfully.",
      data: rows,
      count: count,
    };
  } catch (error: any) {
    moMessage(`chartController.acList`, error?.message || error, "error");
    result.message = error?.message || "Failed to connect to MongoDB.";
  }

  return result;
};

export default {
  acList,
};
