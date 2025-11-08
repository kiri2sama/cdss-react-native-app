import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function PatientEvaluationScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Patient Evaluation</Text>
      <Text>Evaluation interface will be implemented here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});