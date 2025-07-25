import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import SwipeDeck, { Listing } from '@/components/SwipeDeck';
import { ThemedText } from '@/components/ThemedText';

// Sample data for demonstration
const sampleListings: Listing[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: '$2,500/month',
    location: 'Downtown Seattle, WA',
    bedrooms: 2,
    bathrooms: 2,
    description: 'Beautiful modern apartment with city views, updated kitchen, and in-unit laundry. Walking distance to shops and restaurants.',
  },
  {
    id: '2',
    title: 'Cozy Suburban Home',
    price: '$1,800/month',
    location: 'Bellevue, WA',
    bedrooms: 3,
    bathrooms: 2.5,
    description: 'Spacious family home with large backyard, quiet neighborhood, and excellent schools nearby.',
  },
  {
    id: '3',
    title: 'Luxury High-Rise Condo',
    price: '$3,200/month',
    location: 'Capitol Hill, Seattle',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Stunning high-rise condo with panoramic views, concierge service, and rooftop amenities.',
  },
  {
    id: '4',
    title: 'Charming Cottage',
    price: '$1,600/month',
    location: 'Fremont, Seattle',
    bedrooms: 2,
    bathrooms: 1,
    description: 'Quaint cottage with original hardwood floors, cozy fireplace, and private garden.',
  },
  {
    id: '5',
    title: 'Waterfront Loft',
    price: '$2,800/month',
    location: 'South Lake Union, Seattle',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Industrial loft with exposed brick, high ceilings, and stunning water views.',
  },
];

export default function HomeScreen() {
  const handleSwipeFeedback = (listing: Listing, direction: 'left' | 'right') => {
    console.log(`User swiped ${direction} on listing: ${listing.title}`);
    // Here you could implement actual feedback logic like:
    // - Saving preferences to database
    // - Sending analytics events
    // - Updating recommendation algorithm
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Swipe Right Home
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Find your perfect home
        </ThemedText>
      </View>

      <SwipeDeck
        listings={sampleListings}
        onSwipeFeedback={handleSwipeFeedback}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});
