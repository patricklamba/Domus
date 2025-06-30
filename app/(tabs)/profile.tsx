import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard as Edit3, Save, X, Camera } from 'lucide-react-native';

export default function ProfileScreen() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    location: profile?.location || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        Alert.alert('Error', 'Failed to update profile');
      } else {
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      location: profile?.location || '',
    });
    setEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editing ? handleCancel() : setEditing(true)}
        >
          {editing ? (
            <X size={24} color="#e74c3c" />
          ) : (
            <Edit3 size={24} color="#3498db" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: profile?.avatar_url || 
                   'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' 
            }}
            style={styles.avatar}
          />
          {editing && (
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.roleText}>
          {profile?.role === 'employer' ? '👔 Employer' : '🧹 Cleaner'}
        </Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.full_name}
              onChangeText={(text) => setFormData({ ...formData, full_name: text })}
              placeholder="Enter your full name"
            />
          ) : (
            <Text style={styles.value}>{profile?.full_name || 'Not provided'}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <Text style={[styles.value, styles.disabledValue]}>{profile?.email}</Text>
          <Text style={styles.helpText}>Email cannot be changed</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.phone_number}
              onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{profile?.phone_number || 'Not provided'}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Enter your location"
            />
          ) : (
            <Text style={styles.value}>{profile?.location || 'Not provided'}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role</Text>
          <Text style={[styles.value, styles.disabledValue]}>
            {profile?.role === 'employer' ? 'Employer' : 'Cleaner'}
          </Text>
          <Text style={styles.helpText}>Role cannot be changed</Text>
        </View>

        {editing && (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Save size={20} color="#fff" style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Account Created</Text>
          <Text style={styles.infoValue}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Last Updated</Text>
          <Text style={styles.infoValue}>
            {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2c3e50',
  },
  editButton: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#3498db',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3498db',
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  value: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  disabledValue: {
    color: '#666',
    backgroundColor: '#f8f9fa',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  accountSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
});