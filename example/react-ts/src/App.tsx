import { useContext, useState, ChangeEvent } from "react";
import "./App.css";
import { storeServiceContext } from "@store-service";
import type { FinalApi } from "@user-service/apiFactory.type";
import type { HttpResponse } from "@user-service/xhr.type";
import type { ProductInfo } from "./types/product.type";
import ProductCard from "./components/ProductCard";

function App() {
  const [cache, setCache] = useState(true);
  const [sort, setSort] = useState("asc");
  const [limit, setLimit] = useState(0);
  const [result, setResult] = useState<ProductInfo[]>([]);

  const [abort, setAbort] = useState<() => void>(() => () => {});

  const store = useContext(storeServiceContext);

  const handleRequest = async () => {
    try {
      const [allProd, cancelAllProd] = (store.products.getAll as FinalApi)({ sort, limit }, { cache });

      setAbort(() => cancelAllProd);

      const res = await allProd;

      if ((res as HttpResponse)?.status !== 200) throw new Error("Failed to get products");

      setResult((res as HttpResponse)?.data as ProductInfo[]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="card">
        <div>
          <button onClick={() => setLimit((limit) => --limit)}>-</button>
          <span>limit is {limit}</span>
          <button onClick={() => setLimit((limit) => ++limit)}>+</button>
        </div>
        <div>
          sort is
          <input type="text" onInput={(e: ChangeEvent<HTMLInputElement>) => setSort(e.target.value)} value={sort} />
        </div>
        <div>
          <button onClick={() => setCache((cache) => !cache)}>cache is {cache ? "true" : "false"}</button>
        </div>
        <div>
          <button onClick={() => handleRequest()}>send request</button>
          <button onClick={() => abort()}>abort</button>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {result.map((res) => (
            <ProductCard key={res.id} value={res} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
