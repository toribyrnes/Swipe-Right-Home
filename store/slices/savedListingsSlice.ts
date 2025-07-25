import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Listing {
  id: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  imageUrl: string;
  tags: string[];
  matchPercentage: number;
}

interface SavedListingsState {
  listings: Listing[];
}

const initialState: SavedListingsState = {
  listings: [],
};

const savedListingsSlice = createSlice({
  name: 'savedListings',
  initialState,
  reducers: {
    saveListing: (state, action: PayloadAction<Listing>) => {
      const existingIndex = state.listings.findIndex(
        listing => listing.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.listings.push(action.payload);
      }
    },
    removeSavedListing: (state, action: PayloadAction<string>) => {
      state.listings = state.listings.filter(
        listing => listing.id !== action.payload
      );
    },
    clearSavedListings: (state) => {
      state.listings = [];
    },
  },
});

export const { saveListing, removeSavedListing, clearSavedListings } = savedListingsSlice.actions;
export default savedListingsSlice.reducer;