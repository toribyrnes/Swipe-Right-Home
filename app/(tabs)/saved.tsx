import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeSavedListing, clearSavedListings, Listing } from '@/store/slices/savedListingsSlice';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth } = Dimensions.get('window');

export default function SavedScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const dispatch = useAppDispatch();
  const savedListings = useAppSelector(state => state.savedListings.listings);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveListing = (listingId: string) => {
    dispatch(removeSavedListing(listingId));
  };

  const handleClearAll = () => {
    dispatch(clearSavedListings());
  };

  const renderListingCard = ({ item }: { item: Listing }) => (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.cardImage}
        contentFit="cover"
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatPrice(item.price)}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveListing(item.id)}
          >
            <Text style={styles.removeButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.details, { color: colors.text }]}>
          {item.beds} bed • {item.baths} bath • {item.sqft.toLocaleString()} sqft
        </Text>
        
        <Text style={[styles.address, { color: colors.text }]} numberOfLines={2}>
          {item.address}
        </Text>
        
        <View style={styles.matchContainer}>
          <Text style={[styles.matchText, { color: colors.text }]}>
            {item.matchPercentage}% Match
          </Text>
          <View style={styles.matchBar}>
            <View
              style={[
                styles.matchProgress,
                { width: `${item.matchPercentage}%` },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyIcon, { color: colors.text }]}>💖</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Saved Homes Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.text }]}>
        Start swiping right on homes you love to see them here!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Saved Homes
        </Text>
        {savedListings.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {savedListings.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={[styles.statsText, { color: colors.text }]}>
            {savedListings.length} home{savedListings.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
      )}

      <FlatList
        data={savedListings}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          savedListings.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ff4458',
    borderRadius: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 18,
  },
  details: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 70,
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
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
});