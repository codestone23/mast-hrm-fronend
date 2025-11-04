import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import divisionReducer from './slices/divisionSlice';
import { loggerMiddleware } from './middleware/logger';

export const store = configureStore({
  reducer: {
    user: userReducer,
    division: divisionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
