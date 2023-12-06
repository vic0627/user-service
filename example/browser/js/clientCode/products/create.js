let cancel = () => {
  console.warn("failed to abort request");
};

const createProduct = async () => {
  try {
    const [creation, abortCreation] = $storeAPI.products.create({
      title: $id("products_create-title").value,
      price: $id("products_create-price").value,
      description: $id("products_create-description").value,
      image: $id("products_create-image").files[0],
      category: $id("products_create-category").value,
    });

    cancel = abortCreation;

    const res = await creation;

    if (res.status !== 200) throw new Error("failed to create new product");

    $id("products_create-result").innerText = res.data?.id;
  } catch (error) {
    console.error(error);
  }
};

$id("products_create-request").addEventListener("click", createProduct);
$id("products_create-abort").addEventListener("click", () => cancel());
