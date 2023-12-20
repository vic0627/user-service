import { ChangeEvent, useCallback, useEffect, useState } from "react";
import RequestForm from "../RequestForm";
import ResultDialog from "../ResultDialog";
import ProductCard from "../ProductCard";
import { useStoreService } from "@store-service";
import { ProductInfo } from "src/types/product.type";
import { TextField } from "@mui/material";
import { HttpResponse } from "@user-service/xhr.type";
import { useAppSelector } from "../../store/hooks";
import { selectRuleError } from "../../store/slice/ruleErrorSlice";

const GetOneProduct = () => {
  const store = useStoreService();

  const errors = useAppSelector(selectRuleError);

  const [resultBox, setResultBox] = useState(false);

  const [cache, setCache] = useState(true);

  const [abort, setAbort] = useState<() => void>(() => () => {});

  const [prod, setProd] = useState<ProductInfo>();

  const [error, setError] = useState(false);

  const [id, setId] = useState<number>();

  const onCacheChange = useCallback((cache: boolean) => {
    setCache(cache);
  }, []);

  const sendHandler = async (endReq: () => void) => {
    try {
      const [product, cancael] = store.products.getById({ id }, { cache });

      setAbort(() => cancael);

      const res = await product;

      if ((res as HttpResponse)?.status !== 200) throw new Error("failed to get product by id");

      const data = (res as HttpResponse).data as ProductInfo;

      setProd(data);
      setResultBox(true);
    } catch (error) {
      console.error(error);
    } finally {
      endReq();
    }
  };

  const handleIdChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setId(Number(e.target.value));
  }, []);

  useEffect(() => {
    if (errors.findIndex((err) => err.message.includes("id")) !== -1) setError(true);
  }, [errors]);

  return (
    <>
      <RequestForm title="Get By Id" onSend={sendHandler} onAbort={abort} onCacheChange={onCacheChange}>
        <>
          <TextField
            label="Product id"
            size="small"
            type="number"
            error={error}
            onChange={handleIdChange}
            onFocus={() => setError(false)}
          />
        </>
      </RequestForm>
      <ResultDialog title="Product" open={resultBox} onClose={() => setResultBox(false)}>
        {prod ? <ProductCard value={prod} /> : <></>}
      </ResultDialog>
    </>
  );
};

export default GetOneProduct;
