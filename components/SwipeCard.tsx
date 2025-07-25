import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { Listing } from '@/store/slices/savedListingsSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SwipeCardProps {
  listing: Listing;
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  isTop: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  listing,
  translateX,
  translateY,
  scale,
  isTop,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-15, 0, 15]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, screenWidth / 4],
      [0, 1],
      'clamp'
    );

    return {
      opacity,
    };
  });

  const rejectOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-screenWidth / 4, 0],
      [1, 0],
      'clamp'
    );

    return {
      opacity,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      translateX.value,
      [-screenWidth / 4, 0, screenWidth / 4],
      ['#ff4458', 'transparent', '#4dd865']
    );

    return {
      borderColor,
      borderWidth: 4,
    };
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: colors.background },
        animatedStyle,
        borderStyle,
        !isTop && { zIndex: 0 },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        
        {/* Match Meter */}
        <View style={[styles.matchMeter, { backgroundColor: colors.background }]}>
          <View style={styles.matchMeterContent}>
            <Text style={[styles.matchText, { color: colors.text }]}>
              {listing.matchPercentage}% Match
            </Text>
            <View style={styles.matchBar}>
              <View
                style={[
                  styles.matchProgress,
                  { width: `${listing.matchPercentage}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Like Overlay */}
        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}>
          <Text style={styles.overlayText}>❤️ LIKE</Text>
        </Animated.View>

        {/* Reject Overlay */}
        <Animated.View style={[styles.overlay, styles.rejectOverlay, rejectOverlayStyle]}>
          <Text style={styles.overlayText}>❌ PASS</Text>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatPrice(listing.price)}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={[styles.details, { color: colors.text }]}>
            {listing.beds} bed • {listing.baths} bath • {listing.sqft.toLocaleString()} sqft
          </Text>
        </View>

        <Text style={[styles.address, { color: colors.text }]} numberOfLines={2}>
          {listing.address}
        </Text>

        <View style={styles.tagsContainer}>
          {listing.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    borderRadius: 20,
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
  imageContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  matchMeter: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  matchMeterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  matchBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  matchProgress: {
    height: '100%',
    backgroundColor: '#4dd865',
    borderRadius: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  likeOverlay: {
    backgroundColor: 'rgba(77, 216, 101, 0.8)',
  },
  rejectOverlay: {
    backgroundColor: 'rgba(255, 68, 88, 0.8)',
  },
  overlayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    padding: 20,
    minHeight: 160,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailsRow: {
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    opacity: 0.8,
  },
  address: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});