import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;
const ROTATION_STRENGTH = 60;

export interface Listing {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl?: string;
  description?: string;
}

interface SwipeDeckProps {
  listings: Listing[];
  onSwipeFeedback: (listing: Listing, direction: 'left' | 'right') => void;
  renderCard?: (listing: Listing, index: number) => React.ReactNode;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({
  listings,
  onSwipeFeedback,
  renderCard,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipeFeedback = useCallback((listing: Listing, direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on listing:`, listing.title);
    onSwipeFeedback(listing, direction);
  }, [onSwipeFeedback]);

  const advanceToNextCard = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex + 1);
    setIsAnimating(false);
  }, []);

  const resetCardPosition = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      if (isAnimating) return;
      scale.value = withSpring(1.05);
    },
    onActive: (event) => {
      if (isAnimating) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      if (isAnimating) return;
      
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;

      if (shouldSwipeRight || shouldSwipeLeft) {
        // Swipe animation
        runOnJS(setIsAnimating)(true);
        
        const direction = shouldSwipeRight ? 'right' : 'left';
        const targetX = shouldSwipeRight ? screenWidth + 100 : -screenWidth - 100;
        
        translateX.value = withTiming(targetX, { duration: 300 });
        translateY.value = withTiming(event.translationY + event.velocityY * 0.1, { duration: 300 });
        scale.value = withTiming(0.9, { duration: 300 });

        // Trigger feedback and advance to next card
        if (currentIndex < listings.length) {
          runOnJS(handleSwipeFeedback)(listings[currentIndex], direction);
        }
        
        // Reset position and advance after animation
        setTimeout(() => {
          translateX.value = 0;
          translateY.value = 0;
          scale.value = 1;
          runOnJS(advanceToNextCard)();
        }, 300);
      } else {
        // Snap back animation
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        runOnJS(resetCardPosition)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-screenWidth, 0, screenWidth],
      [-ROTATION_STRENGTH, 0, ROTATION_STRENGTH],
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

  const leftOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const renderDefaultCard = (listing: Listing, index: number) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.location}>{listing.location}</Text>
        <Text style={styles.details}>
          {listing.bedrooms} bed • {listing.bathrooms} bath
        </Text>
        {listing.description && (
          <Text style={styles.description}>{listing.description}</Text>
        )}
      </View>
    </View>
  );

  if (currentIndex >= listings.length) {
    return (
      <View style={styles.container}>
        <View style={styles.endCard}>
          <Text style={styles.endTitle}>You&apos;ve seen everything!</Text>
          <Text style={styles.endSubtitle}>Check back later for new listings</Text>
        </View>
      </View>
    );
  }

  const currentListing = listings[currentIndex];
  const nextListing = listings[currentIndex + 1];

  return (
    <View style={styles.container}>
      {/* Next card (background) */}
      {nextListing && (
        <View style={[styles.cardContainer, styles.nextCard]}>
          {renderCard ? renderCard(nextListing, currentIndex + 1) : renderDefaultCard(nextListing, currentIndex + 1)}
        </View>
      )}

      {/* Current card (foreground) */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          {renderCard ? renderCard(currentListing, currentIndex) : renderDefaultCard(currentListing, currentIndex)}
          
          {/* Swipe overlays */}
          <Animated.View 
            style={[
              styles.overlay, 
              styles.leftOverlay,
              leftOverlayStyle
            ]}
          >
            <Text style={styles.overlayText}>PASS</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.overlay, 
              styles.rightOverlay,
              rightOverlayStyle
            ]}
          >
            <Text style={styles.overlayText}>LIKE</Text>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    position: 'absolute',
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
    zIndex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  leftOverlay: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  rightOverlay: {
    backgroundColor: 'rgba(52, 199, 89, 0.8)',
  },
  overlayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  endCard: {
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  endTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  endSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default SwipeDeck;