const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

module.exports = async function emptyDirectory(...resolvePath) {
  if (!resolvePath?.length) throw new Error("paths required");

  try {
    // 組合完整的目錄路徑
    const fullPath = path.resolve(...resolvePath);

    // 讀取目錄中的所有檔案
    const files = await readdir(fullPath);

    // 遍歷所有檔案，並刪除它們
    for (const file of files) {
      const filePath = path.join(fullPath, file);

      // 判斷是否為檔案還是目錄
      const isDirectory = fs.statSync(filePath).isDirectory();

      // 如果是目錄，遞迴清空目錄
      if (isDirectory) {
        await emptyDirectory(filePath);
      } else {
        // 如果是檔案，直接刪除
        await unlink(filePath);
      }
    }

    // 刪除完畢後，刪除原始目錄
    await rmdir(fullPath);

    return true;
  } catch (error) {
    timeLog(error.message);

    if (error.message.includes("ENOENT: no such file or directory, scandir '/Users/pure90719/code/user-service/dist'"))
      return true;

    return false;
  }
};
