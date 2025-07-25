import { configureStore } from '@reduxjs/toolkit';
import savedListingsSlice from './slices/savedListingsSlice';
import swipeFeedbackSlice from './slices/swipeFeedbackSlice';

export const store = configureStore({
  reducer: {
    savedListings: savedListingsSlice,
    swipeFeedback: swipeFeedbackSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;