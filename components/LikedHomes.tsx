import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppSelector } from '@/store/hooks';
import type { HomeListing } from '@/store/swipeSlice';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 48) / 2;

interface LikedHomeCardProps {
  listing: HomeListing;
}

const LikedHomeCard: React.FC<LikedHomeCardProps> = ({ listing }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: listing.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {listing.title}
        </Text>
        <Text style={styles.cardPrice}>{listing.price}</Text>
        <Text style={styles.cardLocation} numberOfLines={1}>
          {listing.location}
        </Text>
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <IconSymbol name="bed.double" size={12} color="#666" />
            <Text style={styles.detailText}>{listing.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="shower" size={12} color="#666" />
            <Text style={styles.detailText}>{listing.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="square" size={12} color="#666" />
            <Text style={styles.detailText}>{Math.round(listing.sqft / 1000)}k</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const LikedHomes: React.FC = () => {
  const { likedListings, rejectedListings } = useAppSelector(
    (state) => state.swipe
  );

  const renderLikedHome = ({ item }: { item: HomeListing }) => (
    <LikedHomeCard listing={item} />
  );

  if (likedListings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <IconSymbol name="heart" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>No Liked Homes Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start swiping to find your perfect home!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Homes</Text>
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {likedListings.length} liked • {rejectedListings.length} passed
          </Text>
        </View>
      </View>
      
      <FlatList
        data={likedListings}
        renderItem={renderLikedHome}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LikedHomes;