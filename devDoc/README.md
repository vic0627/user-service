# User Service (doc for dev)

```cli
node^18.15.0
```

觀看 Markdown 文件可使用 vs code 的擴充套件「Markdown Preview Enhanced」。

## 功能需求

### Parameter Builder

封裝 API 所需參數，提供統一的參數介面發送 API 請求，其中參數包括：

- 路徑參數 - `example-api-endpoint/:id/:sid`
- 查詢參數 - `example-api-endpoint?name=<NAME>&age=<AGE>`
- 請求體 (Request Body)

假設今天有一接口 `POST baseURL/example-api-endpoint/:id/:sid?name=<NAME>&age=<AGE>`，而 req body 另需 `hobby`、`address` 兩個欄位，且 Content-Type 為 multipart/form-data，在以往使用 fetch、axios 等方法中，需要繁雜的程式碼才能順利發送請求。

透過 API 封裝，可將後續請求時的代價降到最低，例如上述的 API 範例，在使用封裝完後所返回的方法，只需要透過以下的程式碼就能發送請求：

```js
globl.$service.exampleApi({
    id: 123,
    sid: 456,
    name: "切版大阿莫濕",
    age: 23,
    hobby: "研究 CSS",
    address: "地球某個地方"
})
```

其中省略了包括像 request url 的組成、FormData 的建立、HTTP 方法的設置...等等。

### Request Handler

處理實際的 HTTP 請求，包括設置請求頭、HTTP 方法等。

目前規劃兩個策略，於不同環境執行：

1. XHR(原型已完成)：使用最原始的 `XMLHttpRequest` 進行封裝，適用於瀏覽器環境。
2. HTTP：使用 node 環境的 http 模組進行封裝，適用於 node 環境。

**策略必為抽象類 `RequestHandler` 的實現**，後續服務層在引用策略時才能依賴於抽象。

### Cache Manager

管理 API 請求的資料暫存，以減少不必要的請求。可以使用簡單的快取機制，檢測到相同的請求時直接返回暫存值。

### Validation Engine

負責處理參數驗證規則，包括測量長度、大小、自定義型別等。提供生命週期中的驗證過程，以便開發人員設置 side effect、防呆機制等。

目前規劃三種驗證機制：

1. Rule Literal：此套件內置的規則語法，會根據給訂條件自動生成驗證函數
2. RegExp：正規表達式
3. validatorFuntion：自定義驗證規則函數

以字串構成的驗證規則(Rule Literal)，概念大致如下：

1. 先指定基本型別，例如 string、int、number、boolean、file...等等。
2. 若型別本身或其屬性可數，則可以加上後綴 `@`，指定其最大最小或相等值，range 設置使用 `:` 符號，若無 range 符號則認定其值為相等值。
3. 若該參數為陣列，可在型別之後加上 `[]` 指定其為陣列，且方括號內亦可設置陣列長度限制。

以下為語法範例：

- `int` - 整數
- `string@10` - 長度為 10 的字串
- `number@0:` - >= 0 的數字
- `boolean@0:1` - 錯誤，boolean 不可數
- `file@15kb:5mb` - 型別為 File 物件，且 size >= 15kb 和 <= 5mb
- `string@10` - 長度 === 10 的字串
- `int[]` - 整數陣列
- `string[5]` - 長度 === 5 的字串陣列
- `number@0:[3:]` - 長度 >= 3 的數字陣列，且數字必須 >= 0

其他規則以此類推...

### Documentation Generator

生成 API 文件的模組，動態收集端點、參數說明、驗證規則等資訊，生成可閱讀的 API 文件。

## 程式結構

![structure](./img/structure-real.png)

> 淺色底為規劃中、尚未實作的項目。

### 角色功能簡介

- **user interface / index.ts**：彙整單/多個 IoC 容器，提供最終使用者介面，也是引入套件的地方。
- **IoC / Fascade**：控制反轉容器/表象模式，彙整單/多個功能模組，提供一個完整功能。
- **(I) Injectable**：有依賴注入的功能模組。
- **(P) Provider**：無依賴注入的功能模組，提供最純粹的功能，為整個程式架構最基礎單位。

> **[提醒]** 功能在進行切割、拆分時須注意彼此是否有**循環依賴**（A 依賴於 B、B 依賴於 C、C 依賴於 A）。如果有，請考慮其他拆分方式，避免在 IoC 建立依賴實例時出現錯誤。

### 當前結構

## 命名公約

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

### 私有成員

當今天 Injectable 在引入依賴時，請使用 `private readonly` 關鍵字對參數進行聲明，TS 會自動建立你所聲明的成員，無須另外在建構函數內進行賦值。

而當今天需要聲明真正的私有成員時，請使用 `#` 作為前綴。

>關於 JS class 私有屬性，可以參考[這裡](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)
