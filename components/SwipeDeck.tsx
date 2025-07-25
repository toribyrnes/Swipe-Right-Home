import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface SwipeDeckProps {
  listings?: Listing[];
  onLike?: (listing: Listing) => void;
  onDislike?: (listing: Listing) => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ 
  listings = [], 
  onLike = () => {}, 
  onDislike = () => {} 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedListings, setLikedListings] = useState<Listing[]>([]);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(1.05);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      const shouldSwipeRight = event.translationX > 100;
      const shouldSwipeLeft = event.translationX < -100;
      
      if (shouldSwipeRight || shouldSwipeLeft) {
        translateX.value = withSpring(shouldSwipeRight ? 300 : -300);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        
        // Handle the swipe action
        setTimeout(() => {
          if (currentIndex < listings.length) {
            const currentListing = listings[currentIndex];
            if (shouldSwipeRight) {
              onLike(currentListing);
              setLikedListings(prev => [...prev, currentListing]);
            } else {
              onDislike(currentListing);
            }
            setCurrentIndex(prev => prev + 1);
          }
          
          // Reset animation values
          translateX.value = 0;
          translateY.value = 0;
          scale.value = 1;
        }, 200);
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  if (!listings || listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No listings available</Text>
      </View>
    );
  }

  if (currentIndex >= listings.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more listings!</Text>
        <Text style={styles.likedCountText}>
          You liked {likedListings.length} listings
        </Text>
      </View>
    );
  }

  const currentListing = listings[currentIndex];

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.title}>{currentListing.title}</Text>
          <Text style={styles.description}>{currentListing.description}</Text>
          <Text style={styles.price}>${currentListing.price.toLocaleString()}</Text>
        </Animated.View>
      </PanGestureHandler>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe right to like, left to pass
        </Text>
        <Text style={styles.counterText}>
          {currentIndex + 1} of {listings.length}
        </Text>
      </View>
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
  card: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  likedCountText: {
    fontSize: 16,
    color: '#007AFF',
  },
  instructions: {
    marginTop: 40,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  counterText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SwipeDeck;