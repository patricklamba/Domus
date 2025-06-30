import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'employer' | 'cleaner' | null>(null);
  
  const handleRegister = () => {
    if (!name || name.length < 3) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    if (!role) {
      Alert.alert('Error', 'Please select your role');
      return;
    }
    
    // Redirect based on role
    if (role === 'employer') {
      router.replace('/(employer)/map');
    } else {
      router.replace('/(cleaner)/dashboard');
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.emoji}>📝</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Domus Angola today</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#A0A0A0"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#A0A0A0"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        
        <Text style={styles.label}>Take a Profile Photo</Text>
        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoButtonText}>📷 Take Photo</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>I am a:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'employer' ? styles.roleButtonSelected : null]}
            onPress={() => setRole('employer')}
          >
            <Text style={styles.roleEmoji}>👔</Text>
            <Text style={styles.roleText}>Employer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.roleButton, role === 'cleaner' ? styles.roleButtonSelected : null]}
            onPress={() => setRole('cleaner')}
          >
            <Text style={styles.roleEmoji}>🧹</Text>
            <Text style={styles.roleText}>Cleaner</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            (!name || !phoneNumber || !role) ? styles.buttonDisabled : null
          ]}
          onPress={handleRegister}
          disabled={!name || !phoneNumber || !role}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  photoButton: {
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 18,
    color: '#666',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  roleButton: {
    width: '48%',
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  roleButtonSelected: {
    backgroundColor: '#E1F5FE',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  roleEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    height: 60,
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },
  link: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
});