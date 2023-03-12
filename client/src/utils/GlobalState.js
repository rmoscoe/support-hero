import React, { createContext, useContext } from "react";
import { useUserReducer } from "./reducers";
import Auth from "./auth";

const StoreContext = createContext();
const { Provider } = StoreContext;
const user = Auth.getUser();

const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useUserReducer({
        // token: "",
        user: user.data
    });

    return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };