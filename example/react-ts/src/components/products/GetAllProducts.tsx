import { Reducer, useCallback, useContext, useReducer, useState } from "react";
import { storeServiceContext } from "@store-service";
import LimitAndSort from "../LimitAndSort";
import { ValueModel } from "../LimitAndSort";
import type { HttpResponse } from "@user-service/xhr.type";
import type { ProductInfo } from "src/types/product.type";
import ProductCard from "../ProductCard";
import RequestForm from "../RequestForm";
import ResultDialog from "../ResultDialog";

interface PayloadOptions {
  limit?: number;
  sort?: string;
}

interface FormOptions extends PayloadOptions {
  cache: boolean;
}

interface FormAction extends Partial<FormOptions> {
  type: "set_cache" | "set_limit" | "set_sort" | "set_limit_sort";
}

const formValueReducer: Reducer<FormOptions, FormAction> = (state, action) => {
  const { type, limit, sort, cache = false } = action;

  switch (type) {
    case "set_cache":
      return { ...state, cache };

    case "set_limit":
      return { ...state, limit };

    case "set_sort":
      return { ...state, sort };

    case "set_limit_sort":
      return { ...state, limit, sort };

    default:
      return { cache: false };
  }
};

const GetAllProducts = () => {
  const store = useContext(storeServiceContext);

  const [resultBox, setResultBox] = useState(false);

  const [abort, setAbort] = useState<() => void>(() => () => {});

  const [allProducts, setAllProducts] = useState<ProductInfo[]>([]);

  const [formVal, dispatchFormVal] = useReducer(formValueReducer, { cache: false });

  const onCacheChange = useCallback((cache: boolean) => {
    dispatchFormVal({ type: "set_cache", cache });
  }, []);

  const onLimitAndSortChange = useCallback(({ limit, sort }: ValueModel) => {
    dispatchFormVal({ type: "set_limit_sort", limit, sort });
  }, []);

  const onSend = async (endReq: () => void) => {
    try {
      const { cache, limit, sort } = formVal;

      const payload: PayloadOptions = {};

      if (limit !== undefined) payload.limit = limit;
      if (sort !== undefined) payload.sort = sort;

      const [allProd, abortAllProd] = store.products.getAll(payload, { cache });

      setAbort(() => abortAllProd);

      const res = await allProd;

      if ((res as HttpResponse)?.status !== 200) throw new Error("Failed to get products");

      const data = (res as HttpResponse).data as ProductInfo[];

      setAllProducts(data);
      setResultBox(true);
    } catch (error) {
      console.error(error);
    } finally {
      endReq();
    }
  };

  return (
    <>
      <RequestForm title="Get All Products" onSend={onSend} onAbort={abort} onCacheChange={onCacheChange}>
        <LimitAndSort onChange={onLimitAndSortChange} />
      </RequestForm>
      <ResultDialog title="All Products" open={resultBox} onClose={() => setResultBox(false)}>
        {allProducts.map((info) => (
          <ProductCard key={info.title + info.id} value={info} />
        ))}
      </ResultDialog>
    </>
  );
};

export default GetAllProducts;