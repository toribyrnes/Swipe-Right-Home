import { configureStore } from '@reduxjs/toolkit';
import swipeReducer from './swipeSlice';

export const store = configureStore({
  reducer: {
    swipe: swipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;