import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { SwipeCard } from './SwipeCard';
import { FeedbackPanel } from './FeedbackPanel';
import { Listing } from '@/store/slices/savedListingsSlice';
import { useAppDispatch } from '@/store/hooks';
import { saveListing } from '@/store/slices/savedListingsSlice';
import { addFeedback } from '@/store/slices/swipeFeedbackSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SwipeDeckProps {
  listings: Listing[];
  onDeckComplete?: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({ 
  listings, 
  onDeckComplete 
}) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastSwipeAction, setLastSwipeAction] = useState<'liked' | 'rejected'>('liked');
  const [lastSwipedListing, setLastSwipedListing] = useState<Listing | null>(null);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  // Animated values for top card
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Animated values for second card
  const secondCardScale = useSharedValue(0.95);
  const secondCardOpacity = useSharedValue(0.8);

  // Heart animation
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const isLastCard = currentIndex >= listings.length - 1;
  const hasCards = currentIndex < listings.length;

  const triggerHaptics = (type: 'success' | 'reject') => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(
        type === 'success' 
          ? Haptics.ImpactFeedbackStyle.Medium 
          : Haptics.ImpactFeedbackStyle.Light
      );
    }
  };

  const showHeartEffect = () => {
    setShowHeartAnimation(true);
    heartScale.value = withSpring(1.2, { damping: 15, stiffness: 300 });
    heartOpacity.value = withTiming(1, { duration: 200 });
    
    setTimeout(() => {
      heartScale.value = withSpring(0, { damping: 15, stiffness: 300 });
      heartOpacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => setShowHeartAnimation(false), 300);
    }, 800);
  };

  const handleSwipe = (direction: 'left' | 'right', listing: Listing) => {
    const action = direction === 'right' ? 'liked' : 'rejected';
    
    if (direction === 'right') {
      dispatch(saveListing(listing));
      triggerHaptics('success');
      showHeartEffect();
    } else {
      triggerHaptics('reject');
    }

    setLastSwipeAction(action);
    setLastSwipedListing(listing);
    setShowFeedback(true);
  };

  const handleFeedback = (tags: string[]) => {
    if (lastSwipedListing) {
      dispatch(addFeedback({
        listingId: lastSwipedListing.id,
        action: lastSwipeAction,
        tags,
        timestamp: Date.now(),
      }));
    }
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
    
    // Reset animations
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    secondCardScale.value = withSpring(0.95);
    secondCardOpacity.value = 0.8;

    if (currentIndex >= listings.length - 1 && onDeckComplete) {
      setTimeout(onDeckComplete, 500);
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.05);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Animate second card
      const progress = Math.abs(event.translationX) / screenWidth;
      secondCardScale.value = interpolate(progress, [0, 1], [0.95, 1]);
      secondCardOpacity.value = interpolate(progress, [0, 1], [0.8, 1]);
    },
    onEnd: (event) => {
      const threshold = screenWidth * 0.3;
      const velocityThreshold = 500;
      
      const shouldSwipe = 
        Math.abs(event.translationX) > threshold || 
        Math.abs(event.velocityX) > velocityThreshold;

      if (shouldSwipe) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        const targetX = direction === 'right' ? screenWidth + 100 : -screenWidth - 100;
        
        translateX.value = withSpring(targetX, { damping: 20, stiffness: 300 });
        translateY.value = withSpring(event.translationY + event.velocityY * 0.1);
        scale.value = withSpring(0.8);
        
        runOnJS(handleSwipe)(direction, listings[currentIndex]);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        secondCardScale.value = withSpring(0.95);
        secondCardOpacity.value = withSpring(0.8);
      }
    },
  });

  const secondCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondCardScale.value }],
    opacity: secondCardOpacity.value,
  }));

  const heartAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (!hasCards) return;
    
    const targetX = direction === 'right' ? screenWidth + 100 : -screenWidth - 100;
    translateX.value = withSpring(targetX, { damping: 20, stiffness: 300 });
    scale.value = withSpring(0.8);
    
    handleSwipe(direction, listings[currentIndex]);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    secondCardScale.value = 0.95;
    secondCardOpacity.value = 0.8;
  };

  if (!hasCards) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            🎉 You're all caught up!
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            No more listings to review right now
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetDeck}>
            <Text style={styles.resetButtonText}>Swipe Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.deckContainer}>
        {/* Second card (background) */}
        {currentIndex + 1 < listings.length && (
          <Animated.View style={[styles.cardContainer, secondCardStyle]}>
            <SwipeCard
              listing={listings[currentIndex + 1]}
              translateX={useSharedValue(0)}
              translateY={useSharedValue(0)}
              scale={useSharedValue(1)}
              isTop={false}
            />
          </Animated.View>
        )}

        {/* Top card */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.cardContainer}>
            <SwipeCard
              listing={listings[currentIndex]}
              translateX={translateX}
              translateY={translateY}
              scale={scale}
              isTop={true}
            />
          </Animated.View>
        </PanGestureHandler>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleManualSwipe('left')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>❌</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleManualSwipe('right')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>❤️</Text>
          </TouchableOpacity>
        </View>

        {/* Heart animation overlay */}
        {showHeartAnimation && (
          <Animated.View style={[styles.heartAnimation, heartAnimationStyle]}>
            <Text style={styles.heartText}>❤️</Text>
          </Animated.View>
        )}
      </View>

      {/* Feedback panel */}
      <FeedbackPanel
        visible={showFeedback}
        action={lastSwipeAction}
        onTagSelect={handleFeedback}
        onClose={() => {
          setShowFeedback(false);
          nextCard();
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: Platform.select({ ios: 120, android: 100 }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 80,
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  rejectButton: {
    backgroundColor: '#ff4458',
  },
  likeButton: {
    backgroundColor: '#4dd865',
  },
  actionButtonText: {
    fontSize: 24,
  },
  heartAnimation: {
    position: 'absolute',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartText: {
    fontSize: 120,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});