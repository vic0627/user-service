let cache = true;

const printCache = () => {
  $id("products_get_by_id-cache").innerText = cache;
};

printCache();

let cancel;

const getProductsById = async () => {
  try {
    const [reqAllProds, abortAllProds] = $storeAPI.products.getById(
      {
        id: Number($id("products_get_by_id-id").value),
      },
      { cache },
    );

    cancel = abortAllProds;

    const res = await reqAllProds;

    if (res?.status !== 200) throw new Error("Failed to get products");

    const content = Object.entries(res?.data).map(([key, value]) => `<p>${key}：${value}</p>`).join("");

    $id("products_get_by_id-result").innerHTML = content;
  } catch (err) {
    console.error(err, "capture inside fn");
  }
};

$id("products_get_by_id-request").addEventListener("click", async () => {
  try {
    await getProductsById();
  } catch (error) {
    console.error(error, "capture outside fn");
  }
});

$id("products_get_by_id-cache").addEventListener("click", () => {
  cache = !cache;
  printCache();
});

$id("products_get_by_id-abort").addEventListener("click", async () => {
  try {
    if (typeof cancel === "function") cancel("安安~~");
  } catch (error) {
    console.error(error, "capture from calling abort controllor");
  }
});
