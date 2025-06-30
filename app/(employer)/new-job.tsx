import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign } from 'lucide-react-native';
import { JobInput } from '../../components/JobInput';

// Types pour les détails du job
interface JobDetails {
  location: string;
  date: string;
  time: string;
  duration: string;
  pricePerDay: string;
  notes: string;
}

// Type pour les clés de JobDetails
type JobDetailKeys = keyof JobDetails;

export default function NewJobScreen() {
  // State regroupé dans un objet avec typage
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    location: '',
    date: '',
    time: '',
    duration: '',
    pricePerDay: '',
    notes: ''
  });

  // Gestion centralisée des changements avec types
  const handleChange = (field: JobDetailKeys, value: string): void => {
    setJobDetails(prev => ({ ...prev, [field]: value }));
  };

  // Formatage automatique pour l'heure (HH:MM)
  const handleTimeChange = (value: string): void => {
    try {
      // Supprimer tous les caractères non numériques
      const numericValue = value.replace(/\D/g, '');
      
      // Si pas de chiffres, vider le champ
      if (!numericValue) {
        setJobDetails(prev => ({ ...prev, time: '' }));
        return;
      }
      
      let formattedTime = numericValue;
      
      // Formater automatiquement avec ":"
      if (numericValue.length >= 3) {
        const hours = numericValue.slice(0, 2);
        const minutes = numericValue.slice(2, 4);
        formattedTime = `${hours}:${minutes}`;
      }
      
      // Limiter à 5 caractères (HH:MM)
      if (formattedTime.length <= 5) {
        setJobDetails(prev => ({ ...prev, time: formattedTime }));
      }
    } catch (error) {
      console.warn('Error formatting time:', error);
      // En cas d'erreur, ne pas mettre à jour
    }
  };

  // Formatage automatique pour la date (DD/MM/YYYY)
  const handleDateChange = (value: string): void => {
    try {
      // Supprimer tous les caractères non numériques
      const numericValue = value.replace(/\D/g, '');
      
      // Si pas de chiffres, vider le champ
      if (!numericValue) {
        setJobDetails(prev => ({ ...prev, date: '' }));
        return;
      }
      
      let formattedDate = numericValue;
      
      // Formater automatiquement avec "/"
      if (numericValue.length >= 3) {
        const day = numericValue.slice(0, 2);
        const month = numericValue.slice(2, 4);
        const year = numericValue.slice(4, 8);
        
        if (numericValue.length <= 4) {
          formattedDate = `${day}/${month}`;
        } else {
          formattedDate = `${day}/${month}/${year}`;
        }
      }
      
      // Limiter à 10 caractères (DD/MM/YYYY)
      if (formattedDate.length <= 10) {
        setJobDetails(prev => ({ ...prev, date: formattedDate }));
      }
    } catch (error) {
      console.warn('Error formatting date:', error);
      // En cas d'erreur, ne pas mettre à jour
    }
  };

  const calculateTotalPrice = (): string => {
    const days = parseInt(jobDetails.duration) || 0;
    const price = parseInt(jobDetails.pricePerDay) || 0;
    return (days * price).toLocaleString('en-US');
  };

  // Validation améliorée avec type de retour
  const validateForm = (): boolean => {
    const { location, date, time, duration, pricePerDay } = jobDetails;
    return !!(location && date && time && duration && pricePerDay);
  };

  const handleSubmit = (): void => {
    if (!validateForm()) return;
    
    Alert.alert(
      'Job Posted!',
      'Your cleaning job has been successfully posted.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
    
    // Ici vous ajouterez l'appel API pour sauvegarder le job
    // console.log('Job details:', jobDetails);
  };

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
        <View style={{ width: 40 }}></View>
      </View>

      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <JobInput
          icon={<MapPin />}
          label="Location"
          placeholder="Enter exact address"
          value={jobDetails.location}
          onChangeText={(text) => handleChange('location', text)}
        />

        <JobInput
          icon={<Calendar />}
          label="Start Date"
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
          value={jobDetails.date}
          onChangeText={handleDateChange}
        />

        <JobInput
          icon={<Clock />}
          label="Start Time"
          placeholder="HH:MM"
          keyboardType="numeric"
          value={jobDetails.time}
          onChangeText={handleTimeChange}
        />

        <JobInput
          icon={<Calendar />}
          label="Duration (days)"
          placeholder="Number of days"
          keyboardType="numeric"
          value={jobDetails.duration}
          onChangeText={(text) => handleChange('duration', text)}
        />

        <JobInput
          icon={<DollarSign />}
          label="Price per Day (Kz)"
          placeholder="Amount in Kz"
          keyboardType="numeric"
          value={jobDetails.pricePerDay}
          onChangeText={(text) => handleChange('pricePerDay', text)}
        />

        {jobDetails.duration && jobDetails.pricePerDay && (
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Total Estimated Cost:</Text>
            <Text style={styles.totalPriceValue}>{calculateTotalPrice()} Kz</Text>
          </View>
        )}

        <JobInput
          label="Additional Notes"
          placeholder="Special instructions, preferences..."
          multiline={true}
          value={jobDetails.notes}
          onChangeText={(text) => handleChange('notes', text)}
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