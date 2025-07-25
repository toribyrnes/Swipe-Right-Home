# SwipeRight Home 🏠❤️

A Tinder-like mobile app for discovering and saving real estate listings with an intuitive swipe interface.

## ✨ Features

### 🎮 Swipe Interface
- **Tinder-style Cards**: Swipe left to pass, right to save properties
- **Smooth Animations**: Spring-based animations powered by `react-native-reanimated`
- **Visual Feedback**: Color-coded borders and overlays show your swipe direction
- **Haptic Feedback**: Subtle vibrations on iOS for successful saves and rejections

### 📊 Match System
- **Match Meter™**: Each property shows a percentage match based on your preferences
- **Smart Matching**: Visual progress bar indicates compatibility

### 🎯 Gamification Features
- **Heart Animation**: Glowing heart effect when you save a property you love
- **Shake Animation**: Subtle rejection feedback for passed properties
- **Feedback Collection**: Optional tags after each swipe to learn your preferences
- **Progress Tracking**: See how many homes you've saved

### 💾 State Management
- **Redux Store**: Persistent state management for saved listings and feedback
- **Real-time Updates**: Saved properties instantly appear in your collection
- **Analytics Ready**: Swipe feedback collected for future ML improvements

## 🏗️ Architecture

### Components
- **SwipeDeck**: Main swipe interface with gesture handling
- **SwipeCard**: Individual property card with all listing details
- **FeedbackPanel**: Slide-up panel for collecting user sentiment
- **SavedScreen**: List view of all saved properties

### State Management
- **savedListingsSlice**: Manages liked/saved properties
- **swipeFeedbackSlice**: Collects user preference data
- **TypeScript**: Fully typed for better developer experience

### Data
- **Mock Listings**: 6 sample properties with real images from Unsplash
- **Rich Property Data**: Price, beds, baths, sqft, address, tags, and match %

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator or Android emulator, or Expo Go app on your phone

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd swiperighthome
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on your device**:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## 📱 How to Use

### Swipe Tab
1. **Swipe Gestures**: 
   - Swipe right or tap ❤️ to save a property
   - Swipe left or tap ❌ to pass
2. **View Details**: Each card shows price, specs, location, and match percentage
3. **Provide Feedback**: After each swipe, optionally select tags to help us learn your preferences
4. **Manual Controls**: Use the action buttons at the bottom if you prefer tapping

### Saved Tab
1. **View Collection**: See all your saved properties in a list
2. **Remove Properties**: Tap the ❌ on any card to remove it
3. **Clear All**: Reset your entire collection with the "Clear All" button

### Empty State
- When you've reviewed all listings, tap "Swipe Again" to restart the deck

## 🛠️ Technical Details

### Dependencies
- **Expo SDK 53**: Latest stable version
- **React Native Reanimated 3**: Smooth 60fps animations
- **React Native Gesture Handler**: Touch gesture recognition
- **Redux Toolkit**: Modern Redux with less boilerplate
- **Expo Haptics**: Native haptic feedback
- **Expo Blur**: Native blur effects for the feedback panel

### Performance
- **Optimized Animations**: All animations run on the UI thread
- **Efficient Rendering**: Only visible cards are fully rendered
- **Memory Management**: Images are cached and optimized by Expo Image

### Platform Support
- ✅ **iOS**: Full feature support including haptics
- ✅ **Android**: Full feature support 
- ✅ **Web**: Works but some native features limited

## 🎨 Design System

### Colors
- **Like**: #4dd865 (Green)
- **Reject**: #ff4458 (Red)
- **Primary**: #007AFF (Blue)
- **Adaptive**: Supports light and dark themes

### Typography
- **System Fonts**: Native font stacks for each platform
- **Hierarchy**: Clear visual hierarchy with appropriate font weights

### Spacing
- **Mobile-First**: Optimized for mobile screen sizes
- **Safe Areas**: Respects device safe areas and notches

## 🔮 Future Enhancements

- **Real Estate API Integration**: Connect to MLS or Zillow APIs
- **Advanced Filtering**: Price range, location, property type filters
- **Machine Learning**: Use feedback data to improve match percentages
- **Social Features**: Share saved homes with friends/family
- **Map Integration**: See properties on an interactive map
- **Push Notifications**: Alert users to new listings that match their preferences
- **Favorite Neighborhoods**: Save and track preferred areas

## 📄 License

This project is for demonstration purposes. Property images are from Unsplash under their license.

---

**Ready to find your dream home? Start swiping! 🏠💕**
