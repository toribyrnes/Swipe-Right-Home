import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import SwipeDeck from '@/components/SwipeDeck';

// Sample data - replace with your real data
const sampleListings = [
  {
    id: '1',
    title: 'Beautiful Downtown Condo',
    description: 'Modern 2BR/2BA condo in the heart of downtown with amazing city views.',
    price: 450000,
  },
  {
    id: '2',
    title: 'Cozy Suburban Home',
    description: 'Charming 3BR/2BA house with a large backyard and garage.',
    price: 320000,
  },
  {
    id: '3',
    title: 'Luxury Waterfront Villa',
    description: 'Stunning 4BR/3BA villa with private beach access and pool.',
    price: 850000,
  },
  {
    id: '4',
    title: 'Urban Loft Apartment',
    description: 'Industrial-style loft with exposed brick and high ceilings.',
    price: 380000,
  },
  {
    id: '5',
    title: 'Mountain Cabin Retreat',
    description: 'Rustic 2BR cabin surrounded by nature, perfect for getaways.',
    price: 275000,
  },
];

export default function HomeScreen() {
  const handleLike = (listing: any) => {
    console.log('Liked:', listing.title);
    // Handle like action here (save to favorites, etc.)
  };

  const handleDislike = (listing: any) => {
    console.log('Disliked:', listing.title);
    // Handle dislike action here
  };

  return (
    <ThemedView style={styles.container}>
      <SwipeDeck 
        listings={sampleListings}
        onLike={handleLike}
        onDislike={handleDislike}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
