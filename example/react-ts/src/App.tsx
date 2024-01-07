import { useContext, useEffect } from "react";
import { storeServiceContext } from "@store-service";
import DropAlert from "./storeService/components/DropAlert";
import GetAllProducts from "./components/products/GetAllProducts";
import { useAppDispatch } from "./store/hooks";
import { add } from "./store/slice/alertSlice";
import GetOneProduct from "./components/products/GetOneProduct";
import CategorySelector from "./components/CategorySelector";
import PriceField from "./components/PriceField";

function App() {
  const store = useContext(storeServiceContext);

  const dispatch = useAppDispatch();

  useEffect(() => {
    store.setInterceptor({
      onValidationFailed(error: Error) {
        const { name, message } = error;
        dispatch(add({ title: name, message, _id: Math.random() }));
      },
      onRequestFailed(error: Error) {
        const { name, message } = error;
        dispatch(add({ title: name, message, _id: Math.random() }));
      },
    });
  }, []);

  return (
    <>
      <DropAlert />
      <GetAllProducts />
      <GetOneProduct />
      <CategorySelector />
      <PriceField />
    </>
  );
}

export default App;
