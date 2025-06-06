import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { CleanerType } from '@/data/mockData';

type MapViewProps = {
  cleaners: CleanerType[];
  selectedCleanerId: number | null;
  onSelectCleaner: (id: number) => void;
};

export default function MapView({ cleaners, selectedCleanerId, onSelectCleaner }: MapViewProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://www.mapz.com/stadtplan/image/luanda_multicolor.png' }}
        style={styles.mapBackground}
      >
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>🏠 Home</Text>
        </TouchableOpacity>
        
        <View style={styles.mapContent}>
          {cleaners.map((cleaner) => (
            <TouchableOpacity
              key={cleaner.id}
              style={[
                styles.cleanerMarker,
                selectedCleanerId === cleaner.id && styles.selectedMarker,
                { 
                  top: `${30 + (cleaner.id * 10)}%`,
                  left: `${20 + (cleaner.id * 15)}%`
                }
              ]}
              onPress={() => onSelectCleaner(cleaner.id)}
            >
              <View style={styles.markerContent}>
                <Text style={styles.markerInitial}>{cleaner.name.charAt(0)}</Text>
                <View style={styles.markerInfo}>
                  <Text style={styles.markerRating}>⭐ {cleaner.rating.toFixed(1)}</Text>
                  {cleaner.isOnline && (
                    <Text style={styles.markerAvailability}>🟢</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  homeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapContent: {
    flex: 1,
    position: 'relative',
  },
  cleanerMarker: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMarker: {
    borderWidth: 3,
    borderColor: '#3498db',
    transform: [{ scale: 1.1 }],
  },
  markerContent: {
    alignItems: 'center',
  },
  markerInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498db',
  },
  markerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  markerRating: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  markerAvailability: {
    fontSize: 10,
  },
});