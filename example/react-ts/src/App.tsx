import { useContext, useEffect } from "react";
import { storeServiceContext } from "@store-service";
import RuleError from "./storeService/components/RuleError";
import GetAllProducts from "./components/products/GetAllProducts";
import { useAppDispatch } from "./store/hooks";
import { add } from "./store/slice/ruleErrorSlice";

function App() {
  const store = useContext(storeServiceContext);

  const dispatch = useAppDispatch();

  useEffect(() => {
    store.setInterceptor({
      onValidationFailed(error: Error) {
        const { name, message } = error;
        dispatch(add({ name, message, id: Math.random() }));
      },
    });
  }, []);

  return (
    <>
      <RuleError />
      <GetAllProducts />
    </>
  );
}

export default App;
