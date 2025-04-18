import { configureStore, combineReducers } from '@reduxjs/toolkit'
import  userReducer from './user/userSlice'
import foodReducer from './food/foodSlice';
import orderReducer from "./order/orderSlice";
import { persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({
  user: userReducer,
  food: foodReducer,
  order: orderReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
}) 

export const persistor = persistStore(store)