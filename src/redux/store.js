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
import orebiReducer, { addToCart } from "./orebiSlice";
import { trackEvent, CURRENCY } from "../analytics/metaPixel";

// Sends a Meta Pixel AddToCart for every add-to-cart, whichever button dispatched it.
const metaPixelMiddleware = () => (next) => (action) => {
  if (addToCart.match(action)) {
    const { _id, name, price, quantity } = action.payload;
    trackEvent("AddToCart", {
      content_ids: [_id],
      content_name: name,
      content_type: "product",
      value: Number(price) * Number(quantity),
      currency: CURRENCY,
    });
  }
  return next(action);
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, orebiReducer);

export const store = configureStore({
  reducer: { orebiReducer: persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(metaPixelMiddleware),
});

export let persistor = persistStore(store);
