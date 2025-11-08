import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function PharmacistDashboard({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Pharmacist Dashboard</Text>
      <Card style={styles.card}>
        <Card.Title title="Pending Cases" />
        <Card.Content>
          <Text>You have 3 pending patient evaluations.</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Evaluations')}>
            View Cases
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginTop: 20,
  },
});