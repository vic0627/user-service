let cancel = () => {
  console.warn("failed to abort request");
};

const deleteProduct = async () => {
  try {
    const [delProd, abort] = $storeAPI.products.delete({
      id: $id("products_delete-id").value,
    });

    cancel = abort;

    const res = await delProd;

    if (res?.status !== 200) throw new Error("Failed to get products");

    console.log(res?.data);
  } catch (err) {
    console.error(err, "capture inside fn");
  }
};

$id("products_delete-request").addEventListener("click", deleteProduct);
$id("products_delete-abort").addEventListener("click", () => cancel());
