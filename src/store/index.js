import {
  configureStore,
  combineReducers,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import PartnersSlice from "./partnersSlice";
import PartnerApprovalsSlice from "./partnerApprovalsSlice";

const reducers = combineReducers({
  partners: PartnersSlice,
  partnerApprovals: PartnerApprovalsSlice,
});

const reducerProxy = (state, action) => {
  if (action.type === "logout/LOGOUT") {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

export const store = configureStore({
  reducer: reducerProxy,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const logout = createAsyncThunk(
  "user/logout",
  async function (_payload, thunkAPI) {
    thunkAPI.dispatch({ type: "logout/LOGOUT" });
  }
);

export default store;
