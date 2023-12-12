$id("carts_get_all").innerHTML = `
<h3>獲取所有購物車的內容或相關信息</h3>
<p>快取：<button id="carts_get_all-cache"></button></p>
<p>
  排序方式：
  <select id="carts_get_all-sort">
    <option value="asc">升冪</option>
    <option value="desc">降冪</option>
    <option value="abc">參數驗證測試</option>
  </select>
</p>
<label for="carts_get_all-limit">
  數量：
  <input type="number" id="carts_get_all-limit" value="10" />
</label>
<label for="carts_get_all-startdate">
  開始日期：
  <input type="date" id="carts_get_all-startdate" />
</label>
<label for="carts_get_all-enddate">
  結束日期：
  <input type="text" id="carts_get_all-enddate" />
</label>
<div style="margin-top: 20px">
  <button id="carts_get_all-request">點我發請求</button>
  <button id="carts_get_all-abort">點我取消請求</button>
</div>
<div id="carts_get_all-result_wrapper" class="result_wrapper">
  <h4>請求結果：</h4>
  <div id="carts_get_all-result" class="result"></div>
</div>
`;
