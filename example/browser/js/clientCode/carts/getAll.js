let cache = true;

const printCache = () => {
  $id("carts_get_all-cache").innerText = cache;
};

printCache();

let cancel;

const getAllCarts = async () => {
  try {
    const payload = {};

    if ($id("carts_get_all-sort").value) payload.sort = $id("carts_get_all-sort").value;
    if ($id("carts_get_all-limit").value) payload.limit = Number($id("carts_get_all-limit").value);
    if ($id("carts_get_all-startdate").value) payload.startdate = $id("carts_get_all-startdate").value;
    if ($id("carts_get_all-enddate").value) payload.enddate = $id("carts_get_all-enddate").value;
    console.log(payload);

    const [allCarts, abortAllCarts] = $storeAPI.carts.getAll(payload, { cache });

    cancel = abortAllCarts;

    const res = await allCarts;

    if (res?.status !== 200) throw new Error("Failed to get all carts");

    const item = res.data.map((item) => ({ id: item?.id, length: item?.products?.length }));

    $id("carts_get_all-result").innerHTML = "";

    item.forEach((o) => {
      const quantity = document.createElement("div");
      quantity.innerText = "購物車 " + o.id + " 有 " + o.length + " 種商品";
      $id("carts_get_all-result").appendChild(quantity);
    });
  } catch (err) {
    console.error(err);
  }
};

$id("carts_get_all-request").addEventListener("click", async () => {
  try {
    await getAllCarts();
  } catch (error) {
    console.error(error, "capture outside fn");
  }
});

$id("carts_get_all-cache").addEventListener("click", () => {
  cache = !cache;
  printCache();
});

$id("carts_get_all-abort").addEventListener("click", async () => {
  try {
    if (typeof cancel === "function") cancel("安安~~");
  } catch (error) {
    console.error(error, "capture from calling abort controllor");
  }
});
