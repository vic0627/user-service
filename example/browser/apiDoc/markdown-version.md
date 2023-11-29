# $storeAPI API documentation

FakeStoreAPI 是一個提供虛擬商店數據的開發者友好的公開 API。這個 API 提供了各種模擬真實電商環境中所需的端點，包括商品、購物車、訂單等，以方便開發者測試和開發電商相關的應用程式。

## $storeAPI.products

獲取虛擬商店中的所有商品數據，包括商品名稱、價格、描述等詳細信息。

### $storeAPI.products.getAll(payload)

取得所有商品訊息。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | limit | true | int | 1 | -- | -- | false | -- | 回傳商品數量限制，正整數 |
    | sort | true | -- | -- | -- | -- | true | -- | 排序方式，預設升冪排列 |

### $storeAPI.products.getById(payload)

依 id 取得單項商品訊息。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | id | false | int | 1 | -- | -- | false | -- | 商品 id，正整數 |

### $storeAPI.products.create(payload)

新增商品。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | title | false | string | 1 | 20 | -- | false | -- | 商品標題 |
    | price | false | number | 0 | -- | -- | false | -- | 商品價格 |
    | description | false | string | 1 | 100 | -- | false | -- | 商品描述 |
    | image | false | file | 5mb | -- | -- | false | -- | 商品圖片 |
    | category | false | string | -- | -- | -- | false | -- | 商品分類 |

### $storeAPI.products.update(payload)

更新商品資訊(整體)。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | id | false | int | 1 | -- | -- | false | -- | 商品 id，正整數 |
    | title | false | string | 1 | 20 | -- | false | -- | 商品標題 |
    | price | false | number | 0 | -- | -- | false | -- | 商品價格 |
    | description | false | string | 1 | 100 | -- | false | -- | 商品描述 |
    | image | false | file | 5mb | -- | -- | false | -- | 商品圖片 |
    | category | false | string | -- | -- | -- | false | -- | 商品分類 |

### $storeAPI.products.modify(payload)

更新商品資訊(局部)。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | id | false | int | 1 | -- | -- | false | -- | 商品 id，正整數 |
    | title | true | string | 1 | 20 | -- | false | -- | 商品標題 |
    | price | true | number | 0 | -- | -- | false | -- | 商品價格 |
    | description | true | string | 1 | 100 | -- | false | -- | 商品描述 |
    | image | true | file | 5mb | -- | -- | false | -- | 商品圖片 |
    | category | true | string | -- | -- | -- | false | -- | 商品分類 |

### $storeAPI.products.delete(payload)

依 id 刪除商品。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | id | false | int | 1 | -- | -- | false | -- | 商品 id，正整數 |

### $storeAPI.products.getCategories()

取得所有商品種類。

### $storeAPI.products.getProductsIn(payload)

取得特定種類所有商品。

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | category | false | string | -- | -- | -- | false | -- | 商品分類 |
    | limit | true | int | 1 | -- | -- | false | -- | 回傳商品數量限制，正整數 |
    | sort | true | -- | -- | -- | -- | true | -- | 排序方式，預設升冪排列 |

## $storeAPI.auth(payload)

- Payload:
    | name | optional | type | min | max | equal | customize validator | rule set | description |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | username | false | string | 3 | 15 | -- | true | intersection | 使用者名稱 |
    | password | false | string | 8 | 20 | -- | false | -- | 使用者密碼 |
