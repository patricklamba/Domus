import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, Hop as Mop } from 'lucide-react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: null as 'employer' | 'cleaner' | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length < 9) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp(
        formData.email.trim().toLowerCase(),
        formData.password,
        {
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber,
          role: formData.role!,
        }
      );

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ general: 'An account with this email already exists' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        // Navigate based on role
        if (formData.role === 'employer') {
          router.replace('/(tabs)');
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string | 'employer' | 'cleaner') => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Domus Angola today</Text>
        </View>

        <View style={styles.form}>
          {errors.general && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
              <User size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A0A0"
                value={formData.fullName}
                onChangeText={(text) => updateFormData('fullName', text)}
              />
            </View>
            {errors.fullName && <Text style={styles.fieldError}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
              />
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, errors.phoneNumber && styles.inputError]}>
              <Phone size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => updateFormData('phoneNumber', text)}
              />
            </View>
            {errors.phoneNumber && <Text style={styles.fieldError}>{errors.phoneNumber}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.fieldError}>{errors.confirmPassword}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>I am a:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[
                  styles.roleButton, 
                  formData.role === 'employer' && styles.roleButtonSelected,
                  errors.role && !formData.role && styles.roleButtonError
                ]}
                onPress={() => updateFormData('role', 'employer')}
              >
                <Briefcase size={32} color={formData.role === 'employer' ? '#3498db' : '#666'} />
                <Text style={[
                  styles.roleText,
                  formData.role === 'employer' && styles.roleTextSelected
                ]}>
                  Employer
                </Text>
                <Text style={styles.roleDescription}>
                  I need cleaning services
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.roleButton, 
                  formData.role === 'cleaner' && styles.roleButtonSelected,
                  errors.role && !formData.role && styles.roleButtonError
                ]}
                onPress={() => updateFormData('role', 'cleaner')}
              >
                <Mop size={32} color={formData.role === 'cleaner' ? '#2ecc71' : '#666'} />
                <Text style={[
                  styles.roleText,
                  formData.role === 'cleaner' && styles.roleTextSelected
                ]}>
                  Cleaner
                </Text>
                <Text style={styles.roleDescription}>
                  I provide cleaning services
                </Text>
              </TouchableOpacity>
            </View>
            {errors.role && <Text style={styles.fieldError}>{errors.role}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
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
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  fieldError: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonSelected: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  roleButtonError: {
    borderColor: '#e74c3c',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  roleTextSelected: {
    color: '#3498db',
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    height: 56,
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
    shadowOpacity: 0,
    elevation: 0,
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