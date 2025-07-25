import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SwipeFeedback {
  listingId: string;
  action: 'liked' | 'rejected';
  tags: string[];
  timestamp: number;
}

interface SwipeFeedbackState {
  feedback: SwipeFeedback[];
}

const initialState: SwipeFeedbackState = {
  feedback: [],
};

const swipeFeedbackSlice = createSlice({
  name: 'swipeFeedback',
  initialState,
  reducers: {
    addFeedback: (state, action: PayloadAction<SwipeFeedback>) => {
      state.feedback.push(action.payload);
    },
    clearFeedback: (state) => {
      state.feedback = [];
    },
  },
});

export const { addFeedback, clearFeedback } = swipeFeedbackSlice.actions;
export default swipeFeedbackSlice.reducer;