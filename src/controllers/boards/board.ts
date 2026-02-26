import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";
import daoBoard from "../../models/boards/board.dao";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  let conn: any;
  let rowsCount = 0;

  try {

    const conn = await getPools();

    const rows = await daoBoard.etList(conn, params);
    const rowCount = await daoBoard.etCount(conn);

    result = {
      success: true,
      message: "",
      data: rows,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(
      `boardController.acList`,
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
