import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { likeListing, rejectListing, resetDeck } from '@/store/swipeSlice';
import type { HomeListing } from '@/store/swipeSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = screenHeight * 0.7;
const SWIPE_THRESHOLD = screenWidth * 0.25;

interface SwipeCardProps {
  listing: HomeListing;
  index: number;
  currentIndex: number;
  onSwipeLeft: (listing: HomeListing) => void;
  onSwipeRight: (listing: HomeListing) => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  listing,
  index,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(0.95);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      const { translationX, velocityX } = event;
      
      scale.value = withSpring(1);
      
      if (Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500) {
        // Swipe detected
        translateX.value = withSpring(
          translationX > 0 ? screenWidth : -screenWidth,
          { velocity: velocityX }
        );
        translateY.value = withSpring(0);
        
        if (translationX > 0) {
          runOnJS(onSwipeRight)(listing);
        } else {
          runOnJS(onSwipeLeft)(listing);
        }
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-screenWidth, 0, screenWidth],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const rejectOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  if (index < currentIndex - 1 || index > currentIndex + 1) {
    return null;
  }

  const isActive = index === currentIndex;
  const zIndex = isActive ? 1000 : 999 - index;

  return (
    <PanGestureHandler onGestureEvent={isActive ? gestureHandler : undefined}>
      <Animated.View
        style={[
          styles.card,
          { zIndex },
          isActive ? cardStyle : { opacity: 0.5, transform: [{ scale: 0.95 }] },
        ]}
      >
        <Image source={{ uri: listing.imageUrl }} style={styles.cardImage} />
        
        {/* Like Overlay */}
        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}>
          <Text style={styles.overlayText}>LIKE</Text>
        </Animated.View>
        
        {/* Reject Overlay */}
        <Animated.View style={[styles.overlay, styles.rejectOverlay, rejectOverlayStyle]}>
          <Text style={styles.overlayText}>PASS</Text>
        </Animated.View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{listing.title}</Text>
          <Text style={styles.cardPrice}>{listing.price}</Text>
          <Text style={styles.cardLocation}>{listing.location}</Text>
          
          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <IconSymbol name="bed.double" size={16} color="#666" />
              <Text style={styles.detailText}>{listing.bedrooms} bed</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="shower" size={16} color="#666" />
              <Text style={styles.detailText}>{listing.bathrooms} bath</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="square" size={16} color="#666" />
              <Text style={styles.detailText}>{listing.sqft.toLocaleString()} sqft</Text>
            </View>
          </View>
          
          <Text style={styles.cardDescription}>{listing.description}</Text>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const SwipeDeck: React.FC = () => {
  const dispatch = useAppDispatch();
  const { listings, currentIndex, likedListings, rejectedListings } = useAppSelector(
    (state) => state.swipe
  );

  const handleSwipeLeft = (listing: HomeListing) => {
    dispatch(rejectListing(listing));
  };

  const handleSwipeRight = (listing: HomeListing) => {
    dispatch(likeListing(listing));
  };

  const handleLikePress = () => {
    const currentListing = listings[currentIndex];
    if (currentListing) {
      dispatch(likeListing(currentListing));
    }
  };

  const handleRejectPress = () => {
    const currentListing = listings[currentIndex];
    if (currentListing) {
      dispatch(rejectListing(currentListing));
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Deck',
      'Are you sure you want to reset the deck? This will clear all your likes and rejections.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => dispatch(resetDeck()) },
      ]
    );
  };

  if (currentIndex >= listings.length) {
    return (
      <View style={styles.container}>
        <View style={styles.endCard}>
          <IconSymbol name="house.fill" size={80} color="#007AFF" />
          <Text style={styles.endTitle}>No More Homes!</Text>
                     <Text style={styles.endSubtitle}>
             You&apos;ve seen all available listings.
           </Text>
          <Text style={styles.endStats}>
            Liked: {likedListings.length} • Passed: {rejectedListings.length}
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        {listings.map((listing, index) => (
          <SwipeCard
            key={listing.id}
            listing={listing}
            index={index}
            currentIndex={currentIndex}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        ))}
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.rejectButton} onPress={handleRejectPress}>
          <IconSymbol name="xmark" size={30} color="#FF3B30" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
          <IconSymbol name="heart.fill" size={30} color="#34C759" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  deckContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  likeOverlay: {
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
  },
  rejectOverlay: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 40,
    width: '100%',
  },
  rejectButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  endCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  endTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  endStats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SwipeDeck;