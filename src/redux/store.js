import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import orebiReducer from "./orebiSlice";
import adminReducer from "./adminSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedOrebiReducer = persistReducer(persistConfig, orebiReducer);
const persistedAdminReducer = persistReducer({ ...persistConfig, key: "admin" }, adminReducer);

export const store = configureStore({
  reducer: { 
    orebiReducer: persistedOrebiReducer,
    adminReducer: persistedAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
