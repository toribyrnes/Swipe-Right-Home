import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { SwipeDeck } from '@/components/SwipeDeck';
import { mockListings } from '@/data/mockListings';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleDeckComplete = () => {
    // This could trigger a refresh or show some completion state
    console.log('Deck complete!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          SwipeRight Home
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Find your perfect home
        </Text>
      </View>
      
      <SwipeDeck 
        listings={mockListings} 
        onDeckComplete={handleDeckComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 4,
  },
});
