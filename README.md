# SwipeRightHome - Real Estate Swipe App 🏠

A Tinder-style home browsing app built with React Native, Expo, and Redux Toolkit. Swipe right to like homes, swipe left to pass, and view your liked properties in a dedicated tab.

## Features

- 🏠 **Swipe Interface**: Tinder-style card swiping for browsing homes
- ❤️ **Like/Pass System**: Swipe right to like, left to pass, or use action buttons
- 📱 **Gesture Support**: Smooth pan gestures with visual feedback and animations
- 🔄 **Redux State Management**: Centralized state for likes, passes, and current listings
- 📋 **Liked Homes View**: See all your liked properties in a grid layout
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- 📊 **Statistics**: Track likes and passes with visual feedback

## Tech Stack

- **React Native** with Expo
- **Redux Toolkit** for state management
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for swipe gestures
- **Expo Router** for navigation
- **TypeScript** for type safety

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open the app in:
   - [Expo Go](https://expo.dev/go) on your mobile device
   - iOS Simulator
   - Android Emulator
   - Web browser

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Swipe screen (main)
│   │   ├── explore.tsx      # Liked homes screen
│   │   └── _layout.tsx      # Tab navigation
│   └── _layout.tsx          # Root layout with Redux Provider
├── components/
│   ├── SwipeDeck.tsx        # Main swipe component
│   └── LikedHomes.tsx       # Liked homes grid
└── store/
    ├── index.ts             # Redux store configuration
    ├── swipeSlice.ts        # Home listings and swipe logic
    └── hooks.ts             # Typed Redux hooks
```

## How to Use

### Swipe Tab
- Swipe right or tap ❤️ to like a home
- Swipe left or tap ✕ to pass on a home
- Cards show home details: price, location, bed/bath count, square footage
- Visual feedback shows "LIKE" or "PASS" while swiping
- Reset deck option when all homes are viewed

### Liked Tab
- View all homes you&apos;ve liked in a grid layout
- See statistics of likes vs passes
- Tap on any home card for more details

## Customization

The app comes with sample home listings. To add your own data:

1. Edit `store/swipeSlice.ts`
2. Update the `initialState.listings` array with your home data
3. Each listing should include: id, title, price, location, bedrooms, bathrooms, sqft, imageUrl, description

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
# Swipe-Right-Home
