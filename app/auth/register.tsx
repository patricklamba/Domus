// app/auth/register.tsx - Modified to use Zelare API
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
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { zelareApi } from '@/lib/api'; // Import Zelare API instead of useAuth for registration

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'employer' | 'cleaner' | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async () => {
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
    
    setLoading(true);
    
    // Format phone number for Angola (+244)
    const formattedPhone = phoneNumber.startsWith('+244') 
      ? phoneNumber 
      : `+244${phoneNumber}`;
    
    try {
      console.log('Starting registration for:', formattedPhone, 'as', role);
      
      // First register the user with Zelare API
      const registerResponse = await zelareApi.register({
        phoneNumber: formattedPhone,
        fullName: name,
        role: role.toUpperCase() as 'EMPLOYER' | 'CLEANER'
      });

      console.log('Registration response:', registerResponse);

      if (registerResponse.success) {
        console.log('User registered successfully, sending OTP...');
        
        // Then send OTP
        const otpResponse = await zelareApi.sendOtp(formattedPhone);
        
        console.log('OTP response:', otpResponse);
        
        if (otpResponse.success) {
          console.log('OTP sent successfully, navigating to verification...');
          
          // Navigate to OTP verification with registration data
          router.push({
            pathname: '/auth/verify-otp',
            params: { 
              phone: formattedPhone, 
              type: 'register',
              name,
              role
            }
          });
        } else {
          Alert.alert('Error', otpResponse.message || 'Failed to send OTP');
        }
      } else {
        Alert.alert('Error', registerResponse.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Zelare Angola today</Text>
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
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+244</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="912345678"
              placeholderTextColor="#A0A0A0"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={9}
            />
          </View>
          
          <Text style={styles.label}>I am a:</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'employer' ? styles.roleButtonSelected : null]}
              onPress={() => setRole('employer')}
            >
              <Text style={styles.roleEmoji}>🏠</Text>
              <Text style={styles.roleText}>Employer</Text>
              <Text style={styles.roleDescription}>Looking for cleaners</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.roleButton, role === 'cleaner' ? styles.roleButtonSelected : null]}
              onPress={() => setRole('cleaner')}
            >
              <Text style={styles.roleEmoji}>🧹</Text>
              <Text style={styles.roleText}>Cleaner</Text>
              <Text style={styles.roleDescription}>Offering cleaning services</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              (!name || !phoneNumber || !role || loading) ? styles.buttonDisabled : null
            ]}
            onPress={handleRegister}
            disabled={!name || !phoneNumber || !role || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Log In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Keep existing styles from your original file
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  roleButton: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: 140,
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
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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