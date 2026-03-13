import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoBoard from "../../models/boards/dao.board";
import daoBoardImage from "../../models/boards/dao.board.image";
import daoBoardFile from "../../models/boards/dao.board.file";

const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  /// get connection
  const conn = await getPools();

  try {

    /// query
    const reRes = await daoBoard.etList(conn, params);
    const rowCount = await daoBoard.etCount(conn);

    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`boardController.acList`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {

    const reRes = await daoBoard.etDetail(conn, id);
    const rowCount = await daoBoard.etCount(conn);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`boardController.acDetail`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    conn.beginTransaction();

    const reRes = await daoBoard.etSave(conn, params);
    if (reRes.affectedRows > 0) {
      const insertId = reRes.insertId;

      // 성공적으로 저장된 경우
      // 이미지, 첨부파일정보를 저장한다.
      params.images.forEach(async (image: any) => {
        let reResImage = await daoBoardImage.etSave(conn, {
          board_id: insertId,
          file_name: image.file_name,
          origin_name: image.origin_name,
        });

        if (!reResImage || reResImage.affectedRows === 0) {
          throw new Error("Failed to save image data.");
        };
      });

      params.files.forEach(async (file: any) => {
        let reResFile = await daoBoardFile.etSave(conn, {
          board_id: insertId, 
          file_name: file.file_name,
          origin_name: file.origin_name,
        });
        if (!reResFile || reResFile.affectedRows === 0) {
          throw new Error("Failed to save file data.");
        };
      });

      result.success = true;
      result.message = "Data saved successfully.";
    } else {
      result.message = "Failed to save data.";
    }

    conn.commit();
  } catch (error: any) {
    conn.rollback();
    moMessage(`boardController.acSave`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const row = await daoBoard.etDetail(conn, params.id);
    if (!row || row.length === 0) {
      result.message = "The specified board does not exist.";
      return result;
    }
    
    const reRes = await daoBoard.etChange(conn, params);
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "Data updated successfully.";
    } else {
      result.message = "Failed to update data.";
    }
  } catch (error: any) {
    moMessage(`boardController.acChange`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();
  try {

    const row = await daoBoard.etDetail(conn, id);
    if (!row || row.length === 0) {
      result.message = "The specified board does not exist.";
      return result;
    }

    const reRes = await daoBoard.etRemove(conn, id);
    
    if (reRes.affectedRows > 0) {
      result.success = true;
      result.message = "Data removed successfully.";
    } else {
      result.message = "Failed to remove data.";
    }
  } catch (error: any) {
    moMessage(`boardController.acRemove`, error?.message || error, "error");
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