import getPools from "../../libs/db.ins";
import { IResult } from "../../libs/interface/result.controller";
import { moMessage } from "../../libs/modules/message";

import daoParticipantDeposit from "../../models/participants/dao.participant.deposit";

// 리스트
const acList = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoParticipantDeposit.etList(conn, params);
    const rowCount = await daoParticipantDeposit.etCount(conn);

    result = {
      success: true,
      message: "",  
      data: reRes,
      count: rowCount[0]?.count || 0,
    };
  } catch (error: any) {
    moMessage(`participantDepositController.acList`, error?.message || error, "error");
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
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    const reRes = await daoParticipantDeposit.etDetail(conn, id);
    result = {
      success: true,
      message: "",
      data: reRes,
      count: reRes.length || 0,
    };
  } catch (error: any) {
    moMessage(`participantDepositController.acDetail`, error?.message || error, "error");
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
    const reRes = await daoParticipantDeposit.etSave(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to save participant deposit data. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    }
  } catch (error: any) {
    moMessage(`participantDepositController.acSave`, error?.message || error, "error");
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
    const reRes = await daoParticipantDeposit.etChange(conn, params);

    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update participant deposit data. Please try again.",
      };
    } else {
      result = {  
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    }
  } catch (error: any) {
    moMessage(`participantDepositController.acChange`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    } 
  }
  return result;
};

const acPatch = async (params: any) => {
  let result: IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  const conn = await getPools();

  try {
    var reRes;
    switch (params.chmode.toLowerCase()) {
      case "isopen":
        reRes = await daoParticipantDeposit.etPatchIsOpen(conn, params);
        break;
    }

    if(!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to update participant deposit data. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    }
  } catch (error: any) {
    moMessage(`participantDepositController.acPatch`, error?.message || error, "error");
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
    const reRes = await daoParticipantDeposit.etRemove(conn, id);
    if (!reRes || reRes.affectedRows === 0) {
      result = {
        success: false,
        message: "Failed to remove participant deposit data. Please try again.",
      };
    } else {
      result = {
        success: true,
        message: "",
        data: reRes,
        count: reRes.affectedRows || 0,
      };
    }
  } catch (error: any) {
    moMessage(`participantDepositController.acRemove`, error?.message || error, "error");
  } finally {
    if (conn) {
      conn.release();
    }
  }
  return result;
};

export default { acList, acDetail, acSave, acChange, acPatch, acRemove };