import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function DoctorDashboard({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Doctor Dashboard</Text>
      <Card style={styles.card}>
        <Card.Title title="Pending Reviews" />
        <Card.Content>
          <Text>You have 2 pharmacist recommendations to review.</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Reviews')}>
            View Reviews
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