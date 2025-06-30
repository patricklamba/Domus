import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  KeyboardTypeOptions 
} from 'react-native';

export interface JobInputProps {
  icon?: React.ReactElement<any>;
  label: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

export const JobInput: React.FC<JobInputProps> = ({ 
  icon, 
  label, 
  placeholder, 
  keyboardType = 'default', 
  multiline = false,
  value,
  onChangeText 
}) => (
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
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
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
});