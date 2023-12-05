$id("products_get_all").innerHTML = `
<h3>取得商品</h3>
<p>快取：<button id="products_get_all-cache"></button></p>
<p>
  排序方式：
  <select id="products_get_all-sort">
    <option value="asc">升冪</option>
    <option value="desc">降冪</option>
    <option value="abc">參數驗證測試</option>
  </select>
</p>
<label for="products_get_all-limit">
  數量：
  <input type="number" id="products_get_all-limit" value="10" />
</label>
<div style="margin-top: 20px">
  <button id="products_get_all-request">點我發請求</button>
  <button id="products_get_all-abort">點我取消請求</button>
</div>
<div id="products_get_all-result_wrapper" class="result_wrapper">
  <h4>請求結果：</h4>
  <div id="products_get_all-result" class="result"></div>
</div>
`;

$id("products_get_by_id").innerHTML = `
<h3>依商品 id 取得商品</h3>
<p>快取：<button id="products_get_by_id-cache"></button></p>
<label for="products_get_by_id-id">
  商品 id
  <input type="number" id="products_get_by_id-id" value="1" min="1" />
</label>
<div style="margin-top: 20px">
  <button id="products_get_by_id-request">點我發請求</button>
  <button id="products_get_by_id-abort">點我取消請求</button>
</div>
<div id="products_get_all-result_wrapper" class="result_wrapper">
  <h4>請求結果：</h4>
  <div id="products_get_by_id-result" class="result"></div>
</div>
`;

$id("products_create").innerHTML = `
<h3>依新增商品</h3>
<label for="products_create-title">
  商品名稱
  <input type="text" id="products_create-title" />
</label>
<label for="products_create-price">
  商品價格
  <input type="number" id="products_create-price" />
</label>
<label for="products_create-description">
  商品描述
  <input type="text" id="products_create-description" />
</label>
<label for="products_create-image">
  商品圖片
  <input type="file" id="products_create-image" />
</label>
<label for="products_create-category">
  商品分類
  <input type="text" id="products_create-category" />
</label>
<div style="margin-top: 20px">
  <button id="products_create-request">點我發請求</button>
  <button id="products_create-abort">點我取消請求</button>
</div>
<div id="products_get_all-result_wrapper" class="result_wrapper">
  <h4>請求結果：</h4>
  <div id="products_create-result" class="result"></div>
</div>
`;
