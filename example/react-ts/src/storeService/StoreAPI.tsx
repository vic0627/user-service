import { ReactNode } from "react";
import { storeServiceContext, storeService } from "./storeContext";

const StoreAPI = ({ children }: { children: ReactNode }) => {
  return <storeServiceContext.Provider value={storeService}>{children}</storeServiceContext.Provider>;
};

export default StoreAPI;
