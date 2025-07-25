import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HomeListing {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  description: string;
}

interface SwipeState {
  listings: HomeListing[];
  currentIndex: number;
  likedListings: HomeListing[];
  rejectedListings: HomeListing[];
  isLoading: boolean;
}

const initialState: SwipeState = {
  listings: [
    {
      id: '1',
      title: 'Modern Downtown Condo',
      price: '$850,000',
      location: 'Downtown Seattle, WA',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      description: 'Beautiful modern condo with city views and premium amenities.',
    },
    {
      id: '2',
      title: 'Cozy Suburban Home',
      price: '$650,000',
      location: 'Bellevue, WA',
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      description: 'Perfect family home with large backyard and excellent schools nearby.',
    },
    {
      id: '3',
      title: 'Luxury Waterfront Villa',
      price: '$2,200,000',
      location: 'Lake Washington, WA',
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 3200,
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      description: 'Stunning waterfront property with private dock and panoramic lake views.',
    },
    {
      id: '4',
      title: 'Historic Capitol Hill Loft',
      price: '$750,000',
      location: 'Capitol Hill, Seattle, WA',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 900,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      description: 'Charming brick loft in vibrant neighborhood with exposed beams.',
    },
    {
      id: '5',
      title: 'Contemporary Townhouse',
      price: '$920,000',
      location: 'Fremont, Seattle, WA',
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1600,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      description: 'Modern 3-story townhouse with rooftop deck and attached garage.',
    },
  ],
  currentIndex: 0,
  likedListings: [],
  rejectedListings: [],
  isLoading: false,
};

const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {
    likeListing: (state, action: PayloadAction<HomeListing>) => {
      state.likedListings.push(action.payload);
      state.currentIndex += 1;
    },
    rejectListing: (state, action: PayloadAction<HomeListing>) => {
      state.rejectedListings.push(action.payload);
      state.currentIndex += 1;
    },
    resetDeck: (state) => {
      state.currentIndex = 0;
      state.likedListings = [];
      state.rejectedListings = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { likeListing, rejectListing, resetDeck, setLoading } = swipeSlice.actions;
export default swipeSlice.reducer;