import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, List } from 'react-native-paper';
import { useCDSS } from '../../contexts/CDSSContext';

export default function DoctorDashboard({ navigation }: any) {
  const { getUserCases } = useCDSS();
  const cases = getUserCases();

  const handleCasePress = (caseId: string) => {
    navigation.navigate('DoctorReviewScreen', { id: caseId });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Doctor Dashboard</Text>
      <Card style={styles.card}>
        <Card.Title title="Pending Reviews" />
        <Card.Content>
          <Text>You have {cases.length} pharmacist recommendations to review.</Text>
          <List.Section>
            {cases.map((caseItem) => (
              <List.Item
                key={caseItem.id}
                title={caseItem.patientName}
                description={`File: ${caseItem.fileNo} - ${caseItem.age}y, ${caseItem.gender}`}
                onPress={() => handleCasePress(caseItem.id)}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
              />
            ))}
          </List.Section>
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