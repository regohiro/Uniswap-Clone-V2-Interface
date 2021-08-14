import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import user from "./user/reducers";
import presale from "./presale/reducers";

const store = configureStore({
  reducer: {
    user,
    presale,
  },
  middleware: [thunk],
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const selectUser = (state: RootState) => state.user;
export const selectPresale = (state: RootState) => state.presale;