import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, List } from 'react-native-paper';
import { useCDSS } from '../../contexts/CDSSContext';

export default function PharmacistDashboard({ navigation }: any) {
  const { getUserCases } = useCDSS();
  const cases = getUserCases();

  const handleCasePress = (caseId: string) => {
    navigation.navigate('PatientEvaluationScreen', { id: caseId });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Pharmacist Dashboard</Text>
      <Card style={styles.card}>
        <Card.Title title="Pending Cases" />
        <Card.Content>
          <Text>You have {cases.length} pending patient evaluations.</Text>
          <FlatList
            data={cases}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.patientName}
                description={`File: ${item.fileNo} - ${item.age}y, ${item.gender}`}
                onPress={() => handleCasePress(item.id)}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            )}
          />
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