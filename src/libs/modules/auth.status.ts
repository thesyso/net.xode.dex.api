import { IResult } from "../interface/result.interface";

export const IsStatus = (status: number) => {
  const res:IResult = {
    success: false,
    message: "an unknown error has occurred. If this continues, please contact your administrator."
  };

  switch (status) {
    case 0:
      // Inactive
      res.message = "account is inactive.";
      break;
    case 1:
      // Active
      res.success = true;
      res.message = "account is active.";
      break;
    case 5:
      // suspended
      res.message = "account is suspended.";
      break;
    case 9:
      // deleted
      res.message = "account is deleted.";
      break;
    default:
      res.message = "invalid account status.";
      break;
  }
  return res;
};

