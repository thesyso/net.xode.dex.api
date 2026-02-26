import moment from "moment";

// console.log(
//     '\x1b[30m%s \x1b[31m%s \x1b[32m%s \x1b[33m%s \x1b[34m%s \x1b[35m%s \x1b[36m%s \x1b[37m%s',
//     'Black',
//     'Red',
//     'Green',
//     'Yellow',
//     'Blue',
//     'Magenta',
//     'Cyan',
//     'White'
// )

// \x1b[1m 굵게  \x1b[2m 얇게
// \x1b[3m 이탤릭 \x1b[4m 밑줄
// \x1b[7m 배경색변경

export const moMessage = (
  name: string,
  message: string,
  level: "info" | "warn" | "error" = "info",
) => {
  const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  let colorCode: string;
  let colorEndCode: string = "\x1b[0m"; // Reset

  switch (level) {
    case "info":
      colorCode = "\x1b[36m"; // Cyan
      break;
    case "warn":
      colorCode = "\x1b[33m"; // Yellow
      break;
    case "error":
      colorCode = "\x1b[31m"; // Red
      break;
    default:
      colorCode = "\x1b[0m"; // Reset
  }
  console.log(`[${timestamp}] [${colorCode}${name}${colorEndCode}] [${colorCode}${level.toUpperCase()}${colorEndCode}] \x1b[0m${message}`);
};
