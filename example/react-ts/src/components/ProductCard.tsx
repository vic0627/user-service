import { ProductInfo } from "../types/product.type";

const ProductCard = ({ value }: { value: ProductInfo }) => {
  const { title, image, price } = value;

  return (
    <div
      className="product_card"
      style={{
        width: "120px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        textAlign: "center",
      }}
    >
      <img
        src={image}
        alt={image}
        style={{
          width: "100px",
        }}
      />
      <h5>{title}</h5>
      <p>$ {price}</p>
    </div>
  );
};

export default ProductCard;
