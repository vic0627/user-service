const fs = require("fs");
const path = require("path");
const timeLog = require("../utils/timeLog.js")

module.exports = function emptyDirectory(...resolvePath) {
  if (!resolvePath?.length) throw new Error("paths required");

  try {
    // 組合完整的目錄路徑
    const fullPath = path.resolve(...resolvePath);

    timeLog("start clearing dir...", fullPath);

    // 讀取目錄中的所有檔案
    const files = fs.readdirSync(fullPath);

    // 遍歷所有檔案，並刪除它們
    files.forEach((file) => {
      const filePath = path.join(fullPath, file);

      // 判斷是否為檔案還是目錄
      const isDirectory = fs.statSync(filePath).isDirectory();

      // 如果是目錄，遞迴清空目錄
      if (isDirectory) {
        emptyDirectory(filePath);
      } else {
        // 如果是檔案，直接刪除
        fs.unlinkSync(filePath);
      }
    });

    // 刪除完畢後，刪除原始目錄
    fs.rmdirSync(fullPath);

    timeLog(fullPath, "dir has been cleared");
  } catch (error) {
    timeLog(error.message);
    return;
  }
};
