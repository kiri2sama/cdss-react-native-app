import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function DoctorReviewScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Doctor Review</Text>
      <Text>Review interface will be implemented here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});