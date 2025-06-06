import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Switch,
  ScrollView 
} from 'react-native';
import { router } from 'expo-router';

export default function AvailabilityScreen() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [workingAreas, setWorkingAreas] = useState([
    { id: 1, name: 'Luanda Centro', selected: true },
    { id: 2, name: 'Talatona', selected: true },
    { id: 3, name: 'Miramar', selected: false },
    { id: 4, name: 'Benfica', selected: false },
    { id: 5, name: 'Viana', selected: false },
  ]);
  
  const toggleArea = (id: number) => {
    setWorkingAreas(
      workingAreas.map(area => 
        area.id === id ? { ...area, selected: !area.selected } : area
      )
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability Settings</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Your Status</Text>
        
        <View style={styles.statusCard}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.statusLabel}>Available for instant jobs</Text>
              <Text style={styles.statusDescription}>
                Employers can see you on the map and send you immediate booking requests
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
              thumbColor={isAvailable ? '#2ecc71' : '#FFF'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={() => setIsAvailable(!isAvailable)}
              value={isAvailable}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.mapSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Map Visibility</Text>
          <Switch
            trackColor={{ false: '#E0E0E0', true: '#BBDEFB' }}
            thumbColor={showMap ? '#3498db' : '#FFF'}
            ios_backgroundColor="#E0E0E0"
            onValueChange={() => setShowMap(!showMap)}
            value={showMap}
          />
        </View>
        
        <View style={styles.mapCard}>
          <Text style={styles.mapPlaceholder}>
            {showMap ? 
              '🗺️ Your current location is visible on the map' : 
              '⚠️ Your location is hidden from the map'}
          </Text>
        </View>
      </View>
      
      <View style={styles.areasSection}>
        <Text style={styles.sectionTitle}>Working Areas</Text>
        <Text style={styles.areasSubtitle}>
          Select the areas where you're available to work
        </Text>
        
        {workingAreas.map(area => (
          <TouchableOpacity 
            key={area.id}
            style={[styles.areaItem, area.selected && styles.areaItemSelected]}
            onPress={() => toggleArea(area.id)}
          >
            <Text style={[styles.areaText, area.selected && styles.areaTextSelected]}>
              {area.name}
            </Text>
            <Text style={styles.areaCheckmark}>
              {area.selected ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.scheduleSection}>
        <Text style={styles.sectionTitle}>Weekly Schedule</Text>
        <Text style={styles.scheduleSubtitle}>
          Set your regular working hours
        </Text>
        
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
          <View key={index} style={styles.dayRow}>
            <Text style={styles.dayName}>{day}</Text>
            <View style={styles.dayTimes}>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeButtonText}>8:00 AM - 5:00 PM</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    flex: 1,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    maxWidth: '80%',
  },
  mapSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  mapCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: 16,
    textAlign: 'center',
  },
  areasSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  areasSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  areaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  areaItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  areaText: {
    fontSize: 16,
    fontWeight: '500',
  },
  areaTextSelected: {
    fontWeight: '600',
    color: '#1565C0',
  },
  areaCheckmark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
  },
  scheduleSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dayName: {
    width: 100,
    fontSize: 16,
    fontWeight: '500',
  },
  dayTimes: {
    flex: 1,
  },
  timeButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timeButtonText: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#3498db',
    margin: 24,
    marginTop: 8,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});