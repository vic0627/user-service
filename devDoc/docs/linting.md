# Linting

## 目錄結構與檔案命名

```text
|- root
|  |- devDoc/ 開發相關文件 
|- example/ 此套件實際使用範例
|- src
|  |- abstract/ 抽象類
|  |- assets/ 靜態資源 or 常數
|  |- core/ 程式主要功能
|  |- decorator/ 裝飾器
|  |- types/ 類型聲明 (type, interface)
|  |- utils/ 共用邏輯
|- test/ 測試 (內部結構暫定與 src 相同)
```

- **靜態資源(常數)**
  - 路徑：src/assets
  - 檔名：Uppercase，單字之間以底線 `_` 作為間隔。
  - 變數名：同上。

- **型別文件**
  - 路徑：src/types
  - 檔名：*.type.ts
  - 變數名：Pascal，每一個單字的首字母都採用大寫字母。

- **裝飾器**
  - 路徑：src/decorator
  - 檔名：*.decorator.ts
  - 變數名：Pascal，每一個單字的首字母都採用大寫字母。

- **Provider**
  - 路徑：無特定路徑。
  - 檔名：*.provider.ts
  - 變數名：Pascal，每一個單字的首字母都採用大寫字母。

- **Injectable**
  - 路徑：無特定路徑。
  - 檔名：*.injectable.ts
  - 變數名：Pascal，每一個單字的首字母都採用大寫字母。

- **IoC Container**
  - 路徑：無特定路徑。
  - 檔名：*.ioc.ts
  - 變數名：Pascal，每一個單字的首字母都採用大寫字母。

## eslint

1. 語句結束後須使用分號結尾
2. 不可省略陳述式的花括號
3. 字串優先使用雙引號
4. 禁止使用 `console.log()` (主要於 commit 時禁止將非註解狀態的 `console.log()` 推送出去)
5. 禁止使用 `var` 宣告變數
6. 空行規範：
    - `let`、`const`、還有表達式，若後面接續包含花括號的述句，需間隔一行
    - 含花括號的述句，若後面接續任何代碼，需間隔一行
    - 表達式，若後面接續 `return` 或 `throw` 關鍵字，需間隔一行

詳細 eslint 規範請見 `.eslintrc.cjs`

## 其他規範

1. 變數、函式名稱統一為 lower camel case
2. 視狀況可用簡寫，但禁止無意義的名稱(ex. `a1`, `bbb`, .etc)
3. 類、函式、變數等功能/參數說明請用 jsdoc 格式，其餘註解使用雙斜線，範例如下：

    ```ts
    /**
     * 取得隨機數
     * @param type 字串或數字
     */
    export const getRanNum = (type: "string" | "number" = "number") => {
        // 取得隨機數字
        const ran = Math.random();

        if (type === "number") {
            return ran;
        } else if (type === "string") {
            // 轉字串
            return ran.toString();
        }

        // 例外狀況
        throw new Error("Get random number failed");
    };
    ```

4. 當今天需要聲明 class 真正的私有成員時，請使用 `#` 作為前綴，而 Injectable 在引入依賴時，請使用 `private readonly` 關鍵字對參數進行聲明，TS 會自動建立你所聲明的成員，無須另外在建構函數內進行賦值。

>關於 JS class 私有屬性，可以參考[這裡](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)
