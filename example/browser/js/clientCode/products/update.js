let cancel = () => {
  console.warn("failed to abort request");
};

const updateProduct = async () => {
  try {
    const payload = {
      id: Number($id("products_update-id").value),
      title: $id("products_update-title").value,
      price: $id("products_update-price").value,
      description: $id("products_update-description").value,
      image: $id("products_update-image").files[0],
      category: $id("products_update-category").value,
    };

    const [updateResponse, abort] = $storeAPI.products.update(payload);

    cancel = abort;

    const res = await updateResponse;

    if (res?.status !== 200) throw new Error("failed to update product");

    $id("products_update-result").innerHTML = `
        <p>已更新 ${res.data?.id || "無"} 號商品</p>
    `;
  } catch (error) {
    console.error(error);
  }
};

$id("products_update-request").addEventListener("click", updateProduct);
$id("products_update-abort").addEventListener("click", () => cancel());
