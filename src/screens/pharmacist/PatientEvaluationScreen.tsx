import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IconSymbol } from '../../components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockCDSSAlerts, DRP_CATEGORIES } from '../../data/mockData';
import { DRPCategory } from '../../types';
import { useCDSS } from '../../contexts/CDSSContext';
import { useAuth } from '../../contexts/AuthContext';
import * as Haptics from 'expo-haptics';

export default function PatientEvaluationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  const { user } = useAuth();
  const { getCase } = useCDSS();
  const patientCase = getCase(id);

  const [selectedDRPs, setSelectedDRPs] = useState<DRPCategory[]>([]);
  const [advice, setAdvice] = useState('');
  const [justification, setJustification] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  if (!patientCase) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.error} />
          <Text style={commonStyles.text}>Case not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  const toggleDRP = (drpId: DRPCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDRPs(prev =>
      prev.includes(drpId)
        ? prev.filter(id => id !== drpId)
        : [...prev, drpId]
    );
  };

  const handleVoiceInput = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(!isRecording);
    Alert.alert(
      'Voice Input',
      'Voice-to-text feature would be integrated here using expo-speech or a similar library'
    );
  };

  const handleAIAssist = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'AI Assistant',
      'AI-generated draft assistance would be integrated here. This could use OpenAI API or similar service.'
    );
  };

  const handleSignature = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('SignatureCapture' as never, {
      caseId: id,
      type: 'pharmacist',
      userId: user.id,
      userName: user.name
    } as never);
  };

  const handleSubmit = () => {
    if (selectedDRPs.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one DRP category');
      return;
    }
    if (!advice.trim()) {
      Alert.alert('Missing Information', 'Please provide your advice');
      return;
    }
    if (!justification.trim()) {
      Alert.alert('Missing Information', 'Please provide justification');
      return;
    }

    console.log('Submitting evaluation:', {
      caseId: id,
      pharmacistId: user.id,
      pharmacistName: user.name,
      selectedDRPs,
      advice,
      justification,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Success',
      'Evaluation submitted successfully. Proceeding to signature capture.',
      [
        {
          text: 'OK',
          onPress: () => handleSignature(),
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.accent;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Pharmacist Info Banner */}
        <View style={[commonStyles.card, styles.pharmacistBanner]}>
          <IconSymbol name="cross.case.fill" size={20} color={colors.primary} />
          <View style={styles.pharmacistInfo}>
            <Text style={styles.pharmacistLabel}>Evaluating as:</Text>
            <Text style={styles.pharmacistName}>{user.name}</Text>
            <Text style={styles.pharmacistId}>ID: {user.id}</Text>
          </View>
        </View>

        {/* Patient Info Card */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>{patientCase.patientName}</Text>
          <View style={styles.patientInfo}>
            <Text style={commonStyles.textSecondary}>File: {patientCase.fileNo}</Text>
            <Text style={commonStyles.textSecondary}>
              {patientCase.age}y, {patientCase.gender}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {patientCase.primaryPhysician}
            </Text>
          </View>
        </View>

        {/* Medical Conditions */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          {patientCase.medicalConditions.map((condition, index) => (
            <View key={index} style={styles.listItem}>
              <IconSymbol name="circle.fill" size={6} color={colors.primary} />
              <Text style={commonStyles.text}>{condition}</Text>
            </View>
          ))}
        </View>

        {/* Allergies */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          {patientCase.allergies.length > 0 ? (
            patientCase.allergies.map((allergy, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
                <Text style={[commonStyles.text, { color: colors.error, fontWeight: '600' }]}>
                  {allergy}
                </Text>
              </View>
            ))
          ) : (
            <Text style={commonStyles.textSecondary}>No known allergies</Text>
          )}
        </View>

        {/* Current Medications */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          {patientCase.currentMedications.map((med, index) => (
            <View key={index} style={styles.listItem}>
              <IconSymbol name="pills.fill" size={16} color={colors.primary} />
              <Text style={commonStyles.text}>{med}</Text>
            </View>
          ))}
        </View>

        {/* CDSS Alerts */}
        <View style={commonStyles.card}>
          <View style={styles.alertHeader}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
            <Text style={styles.sectionTitle}>CDSS Alerts</Text>
          </View>
          {mockCDSSAlerts.map((alert) => (
            <View
              key={alert.id}
              style={[
                styles.alertCard,
                { borderLeftColor: getSeverityColor(alert.severity) },
              ]}
            >
              <View style={styles.alertHeader}>
                <Text style={[styles.alertTitle, { color: getSeverityColor(alert.severity) }]}>
                  {alert.title}
                </Text>
                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(alert.severity) },
                  ]}
                >
                  <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={commonStyles.textSecondary}>{alert.description}</Text>
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationLabel}>Recommendation:</Text>
                <Text style={commonStyles.text}>{alert.recommendation}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* DRP Selection */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Drug Related Problems (DRP)</Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
            Select all applicable categories:
          </Text>
          <View style={styles.drpGrid}>
            {DRP_CATEGORIES.map((drp) => (
              <TouchableOpacity
                key={drp.id}
                style={[
                  styles.drpChip,
                  selectedDRPs.includes(drp.id as DRPCategory) && styles.drpChipSelected,
                ]}
                onPress={() => toggleDRP(drp.id as DRPCategory)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.drpChipText,
                    selectedDRPs.includes(drp.id as DRPCategory) && styles.drpChipTextSelected,
                  ]}
                >
                  {drp.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advice Input */}
        <View style={commonStyles.card}>
          <View style={styles.inputHeader}>
            <Text style={styles.sectionTitle}>Advice (A#)</Text>
            <View style={styles.inputActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleVoiceInput}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={isRecording ? 'mic.fill' : 'mic'}
                  size={20}
                  color={isRecording ? colors.error : colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleAIAssist}
                activeOpacity={0.7}
              >
                <IconSymbol name="sparkles" size={20} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={[commonStyles.input, commonStyles.inputMultiline]}
            placeholder="Enter your clinical advice and recommendations..."
            placeholderTextColor={colors.textSecondary}
            value={advice}
            onChangeText={setAdvice}
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Justification Input */}
        <View style={commonStyles.card}>
          <View style={styles.inputHeader}>
            <Text style={styles.sectionTitle}>Justification</Text>
            <View style={styles.inputActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleVoiceInput}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={isRecording ? 'mic.fill' : 'mic'}
                  size={20}
                  color={isRecording ? colors.error : colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleAIAssist}
                activeOpacity={0.7}
              >
                <IconSymbol name="sparkles" size={20} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={[commonStyles.input, commonStyles.inputMultiline]}
            placeholder="Provide clinical justification for your recommendations..."
            placeholderTextColor={colors.textSecondary}
            value={justification}
            onChangeText={setJustification}
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, styles.submitButton]}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={buttonStyles.buttonText}>Submit & Sign</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  pharmacistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.highlight,
    marginBottom: 16,
  },
  pharmacistInfo: {
    flex: 1,
  },
  pharmacistLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pharmacistName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  pharmacistId: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  patientInfo: {
    marginTop: 8,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: colors.background,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  recommendationBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.highlight,
    borderRadius: 6,
  },
  recommendationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  drpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  drpChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  drpChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  drpChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  drpChipTextSelected: {
    color: colors.card,
    fontWeight: '600',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  submitButton: {
    marginTop: 8,
  },
});