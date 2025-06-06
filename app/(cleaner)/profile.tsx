import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [name, setName] = useState('Maria Silva');
  const [age, setAge] = useState('28');
  const [phone, setPhone] = useState('912345678');
  const [experience, setExperience] = useState('5');
  const [hourlyRate, setHourlyRate] = useState('2500');
  const [bio, setBio] = useState(
    'Professional cleaner with 5 years of experience in residential cleaning. I am detail-oriented and reliable.'
  );
  
  // Sample services
  const [services, setServices] = useState([
    { id: 1, name: 'General Cleaning', selected: true },
    { id: 2, name: 'Deep Cleaning', selected: true },
    { id: 3, name: 'Window Cleaning', selected: true },
    { id: 4, name: 'Laundry', selected: false },
    { id: 5, name: 'Ironing', selected: true },
    { id: 6, name: 'Dishes', selected: true },
  ]);
  
  const toggleService = (id: number) => {
    setServices(
      services.map(service => 
        service.id === id ? { ...service, selected: !service.selected } : service
      )
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.avatarSection}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>📷 Change Photo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <Text style={styles.inputLabel}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>Hourly Rate (Kz)</Text>
        <TextInput
          style={styles.input}
          value={hourlyRate}
          onChangeText={setHourlyRate}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <Text style={styles.sectionSubtitle}>Select the services you provide</Text>
        
        {services.map(service => (
          <TouchableOpacity 
            key={service.id}
            style={[styles.serviceItem, service.selected && styles.serviceItemSelected]}
            onPress={() => toggleService(service.id)}
          >
            <Text style={[styles.serviceText, service.selected && styles.serviceTextSelected]}>
              {service.name}
            </Text>
            <Text style={styles.serviceCheckmark}>
              {service.selected ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.documentsSection}>
        <Text style={styles.sectionTitle}>Documents & References</Text>
        
        <TouchableOpacity style={styles.documentButton}>
          <Text style={styles.documentButtonText}>📄 Upload ID Document</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.documentButton}>
          <Text style={styles.documentButtonText}>📄 Upload Reference Letter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.saveButtonText}>Save Profile</Text>
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
  avatarSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 16,
  },
  formSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  servicesSection: {
    padding: 24,
    paddingTop: 0,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  serviceText: {
    fontSize: 16,
  },
  serviceTextSelected: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  serviceCheckmark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  documentsSection: {
    padding: 24,
    paddingTop: 0,
  },
  documentButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  documentButtonText: {
    fontSize: 16,
    color: '#424242',
  },
  statsSection: {
    padding: 24,
    paddingTop: 0,
  },
  statsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
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