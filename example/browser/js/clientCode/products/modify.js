let cancel = () => {
  console.warn("failed to abort request");
};

const modifyProduct = async () => {
  try {
    const payload = {
      id: $id("products_modify-id").value,
    };

    if ($id("products_modify-title").value) payload.title = $id("products_modify-title").value;
    if ($id("products_modify-price").value) payload.price = $id("products_modify-price").value;
    if ($id("products_modify-description").value) payload.description = $id("products_modify-description").value;
    if ($id("products_modify-image").files[0]) payload.image = $id("products_modify-image").files[0];
    if ($id("products_modify-category").value) payload.category = $id("products_modify-category").value;

    const [updateResponse, abort] = $storeAPI.products.modify(payload);

    cancel = abort;

    const res = await updateResponse;

    if (res?.status !== 200) throw new Error("failed to modify product");

    $id("products_modify-result").innerHTML = `
        <p>已更新 ${res.data?.id || "無"} 號商品</p>
    `;
  } catch (error) {
    console.error(error);
  }
};

$id("products_modify-request").addEventListener("click", modifyProduct);
$id("products_modify-abort").addEventListener("click", () => cancel());
