const createProduct = async () => {
  try {
    const [creation] = $storeAPI.products.create(
      {
        title: $id("products_create-title").value,
        price: $id("products_create-price").value,
        description: $id("products_create-description").value,
        image: $id("products_create-image").files[0],
        category: $id("products_create-category").value,
      },
      {
        interceptor: {
          onBeforeValidation(payload) {
            if (typeof payload.price !== "number") payload.price = Number(payload.price);
          },
        },
      },
    );

    const res = await creation;

    if (res.status !== 200) throw new Error("failed to create new product");

    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

$id("products_create-request").addEventListener("click", createProduct);
