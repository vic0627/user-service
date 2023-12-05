let cache = true;

const printCache = () => {
  $id("products_get_all-cache").innerText = cache;
};

printCache();

let cancel;

const getAllProducts = async (limit) => {
  try {
    const [reqAllProds, abortAllProds] = $storeAPI.products.getAll(
      {
        limit,
        sort: $id("products_get_all-sort").value,
      },
      { cache },
    );

    cancel = abortAllProds;

    const res = await reqAllProds;

    if (res?.status !== 200) throw new Error("Failed to get products");

    const src = res.data.map((item) => item?.image);

    $id("products_get_all-result").innerHTML = "";

    src.forEach((str) => {
      const img = document.createElement("img");
      img.src = str;
      $id("products_get_all-result").appendChild(img);
    });
  } catch (err) {
    console.error(err, "capture inside fn");
  }
};

$id("products_get_all-request").addEventListener("click", async () => {
  const num = $id("products_get_all-limit").value;

  try {
    await getAllProducts(Number(num) || 1);
  } catch (error) {
    console.error(error, "capture outside fn");
  }
});

$id("products_get_all-cache").addEventListener("click", () => {
  cache = !cache;
  printCache();
});

$id("products_get_all-abort").addEventListener("click", async () => {
  try {
    if (typeof cancel === "function") cancel("安安~~");
  } catch (error) {
    console.error(error, "capture from calling abort controllor");
  }
});
