import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function PrescriptionGenerationScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Prescription Generation</Text>
      <Text>Prescription generation interface will be implemented here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});