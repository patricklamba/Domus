import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign } from 'lucide-react-native';

export default function NewJobScreen() {
  // MODIF: State regroupé dans un objet
  const [jobDetails, setJobDetails] = useState({
    location: '',
    date: '',
    time: '',
    duration: '',
    pricePerDay: '',
    notes: ''
  });

  // MODIF: Gestion centralisée des changements
  const handleChange = (field, value) => {
    setJobDetails(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalPrice = () => {
    const days = parseInt(jobDetails.duration) || 0;
    const price = parseInt(jobDetails.pricePerDay) || 0;
    return (days * price).toLocaleString('en-US');
  };

  // MODIF: Validation améliorée
  const validateForm = () => {
    const { location, date, time, duration, pricePerDay } = jobDetails;
    return location && date && time && duration && pricePerDay;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    Alert.alert(
      'Job Posted!',
      'Your cleaning job has been successfully posted.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
    
    // Ici vous ajouterez l'appel API pour sauvegarder le job
    // console.log('Job details:', jobDetails);
  };

  // MODIF: Composant Input réutilisable
  const JobInput = ({ icon, label, field, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, multiline && styles.textAreaContainer]}>
        {icon && React.cloneElement(icon, { 
          size: 20, 
          color: '#666', 
          style: styles.inputIcon 
        })}
        <TextInput
          style={[styles.input, multiline && styles.textArea]}
          placeholder={placeholder}
          value={jobDetails[field]}
          onChangeText={(text) => handleChange(field, text)}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <JobInput
          icon={<MapPin />}
          label="Location"
          field="location"
          placeholder="Enter exact address"
        />

        <JobInput
          icon={<Calendar />}
          label="Start Date"
          field="date"
          placeholder="DD/MM/YYYY"
        />

        <JobInput
          icon={<Clock />}
          label="Start Time"
          field="time"
          placeholder="HH:MM"
        />

        <JobInput
          icon={<Calendar />}
          label="Duration (days)"
          field="duration"
          placeholder="Number of days"
          keyboardType="numeric"
        />

        <JobInput
          icon={<DollarSign />}
          label="Price per Day (Kz)"
          field="pricePerDay"
          placeholder="Amount in Kz"
          keyboardType="numeric"
        />

        {jobDetails.duration && jobDetails.pricePerDay && (
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Total Estimated Cost:</Text>
            <Text style={styles.totalPriceValue}>{calculateTotalPrice()} Kz</Text>
          </View>
        )}

        <JobInput
          label="Additional Notes"
          field="notes"
          placeholder="Special instructions, preferences..."
          multiline={true}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            !validateForm() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!validateForm()}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Post Job Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 60, android: 40 }),
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { height: 2, width: 0 },
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  totalPriceContainer: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: Platform.select({ ios: 40, android: 20 }),
    shadowColor: '#3498db',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 0 },
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});