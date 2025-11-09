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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IconSymbol } from '../../components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockPatientCases, mockRecommendations } from '../../data/mockData';
import { useCDSS } from '../../contexts/CDSSContext';
import * as Haptics from 'expo-haptics';

export default function DoctorReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  const { getCase } = useCDSS();
  const patientCase = getCase(id);
  const recommendation = mockRecommendations.find(r => r.caseId === id);

  const [decision, setDecision] = useState<'approved' | 'rejected' | 'more_info_needed' | null>(null);
  const [comments, setComments] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  if (!patientCase) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={commonStyles.text}>Case not found</Text>
      </SafeAreaView>
    );
  }

  const handleDecision = (selectedDecision: 'approved' | 'rejected' | 'more_info_needed') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDecision(selectedDecision);

    if (selectedDecision === 'approved') {
      setShowSignatureModal(true);
    }
  };

  const handleSignAndSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSignatureModal(false);

    Alert.alert(
      'Success',
      'Decision submitted successfully. Proceeding to generate Doctor Orders Sheet.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('PrescriptionGenerationScreen' as never, { id } as never),
        },
      ]
    );
  };

  const handleReject = () => {
    if (!comments.trim()) {
      Alert.alert('Missing Information', 'Please provide a reason for rejection');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this recommendation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            console.log('Recommendation rejected with comments:', comments);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRequestMoreInfo = () => {
    if (!comments.trim()) {
      Alert.alert('Missing Information', 'Please specify what additional information is needed');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Information Requested',
      'The pharmacist will be notified to provide additional information.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Info Card */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>{patientCase.patientName}</Text>
          <View style={styles.patientInfo}>
            <Text style={commonStyles.textSecondary}>File: {patientCase.fileNo}</Text>
            <Text style={commonStyles.textSecondary}>
              {patientCase.age}y, {patientCase.gender}
            </Text>
            <Text style={commonStyles.textSecondary}>
              Primary Physician: {patientCase.primaryPhysician}
            </Text>
          </View>
        </View>

        {/* Medical Summary */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Medical Summary</Text>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Conditions:</Text>
            {patientCase.medicalConditions.map((condition, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="circle.fill" size={6} color={colors.primary} />
                <Text style={commonStyles.text}>{condition}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Allergies:</Text>
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

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Current Medications:</Text>
            {patientCase.currentMedications.map((med, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="pills.fill" size={16} color={colors.primary} />
                <Text style={commonStyles.text}>{med}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pharmacist Recommendation */}
        {recommendation && (
          <View style={[commonStyles.card, styles.recommendationCard]}>
            <View style={styles.recommendationHeader}>
              <IconSymbol name="cross.case.fill" size={24} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Pharmacist Recommendation</Text>
            </View>

            <View style={styles.pharmacistInfo}>
              <Text style={commonStyles.textSecondary}>
                Reviewed by: {recommendation.pharmacistName}
              </Text>
              <Text style={commonStyles.textSecondary}>
                Date: {new Date(recommendation.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.drpSection}>
              <Text style={styles.summaryLabel}>Identified DRPs:</Text>
              <View style={styles.drpList}>
                {recommendation.drpCategories.map((drp, index) => (
                  <View key={index} style={styles.drpBadge}>
                    <Text style={styles.drpBadgeText}>
                      {drp.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.adviceSection}>
              <Text style={styles.adviceLabel}>Clinical Advice (A#):</Text>
              <View style={styles.adviceBox}>
                <Text style={commonStyles.text}>{recommendation.advice}</Text>
              </View>
            </View>

            <View style={styles.justificationSection}>
              <Text style={styles.summaryLabel}>Justification:</Text>
              <Text style={commonStyles.textSecondary}>{recommendation.justification}</Text>
            </View>

            {recommendation.pharmacistSignature && (
              <View style={styles.signatureSection}>
                <Text style={styles.summaryLabel}>Pharmacist Signature:</Text>
                <View style={styles.signatureBox}>
                  <Text style={commonStyles.textSecondary}>
                    Digitally signed on {new Date(recommendation.pharmacistSignatureDate!).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Comments Section */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>
            {decision === 'rejected' ? 'Reason for Rejection' :
             decision === 'more_info_needed' ? 'Additional Information Needed' :
             'Comments (Optional)'}
          </Text>
          <TextInput
            style={[commonStyles.input, commonStyles.inputMultiline]}
            placeholder={
              decision === 'rejected' ? 'Explain why you are rejecting this recommendation...' :
              decision === 'more_info_needed' ? 'Specify what additional information is needed...' :
              'Add any comments or notes...'
            }
            placeholderTextColor={colors.textSecondary}
            value={comments}
            onChangeText={setComments}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[buttonStyles.success, styles.actionButton]}
            onPress={() => handleDecision('approved')}
            activeOpacity={0.7}
          >
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
            <Text style={[buttonStyles.buttonText, styles.buttonTextWithIcon]}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.danger, styles.actionButton]}
            onPress={() => {
              setDecision('rejected');
              handleReject();
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.card} />
            <Text style={[buttonStyles.buttonText, styles.buttonTextWithIcon]}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.outline, styles.actionButton]}
            onPress={() => {
              setDecision('more_info_needed');
              handleRequestMoreInfo();
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="info.circle" size={20} color={colors.primary} />
            <Text style={[buttonStyles.outlineText, styles.buttonTextWithIcon]}>
              Request Info
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Signature Modal */}
      <Modal
        visible={showSignatureModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSignatureModal(false)}
      >
        <SafeAreaView style={commonStyles.container}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowSignatureModal(false)}
              style={styles.modalCloseButton}
            >
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={commonStyles.subtitle}>Digital Signature</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.signatureCanvas}>
              <Text style={commonStyles.textSecondary}>
                Sign here to approve the recommendation
              </Text>
              <View style={styles.signaturePlaceholder}>
                <IconSymbol name="pencil.tip" size={48} color={colors.textSecondary} />
                <Text style={commonStyles.textSecondary}>
                  Signature capture would be implemented here
                </Text>
              </View>
            </View>

            <View style={styles.signatureInfo}>
              <Text style={commonStyles.text}>
                By signing, you confirm that you have reviewed and approved this recommendation.
              </Text>
              <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
                Timestamp: {new Date().toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              style={[buttonStyles.primary, styles.signButton]}
              onPress={handleSignAndSubmit}
              activeOpacity={0.7}
            >
              <Text style={buttonStyles.buttonText}>Confirm & Sign</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  recommendationCard: {
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  pharmacistInfo: {
    marginBottom: 16,
    gap: 4,
  },
  drpSection: {
    marginBottom: 16,
  },
  drpList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  drpBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  drpBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.card,
  },
  adviceSection: {
    marginBottom: 16,
  },
  adviceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  adviceBox: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  justificationSection: {
    marginBottom: 16,
  },
  signatureSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  signatureBox: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonTextWithIcon: {
    marginLeft: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  signatureCanvas: {
    flex: 1,
    marginBottom: 24,
  },
  signaturePlaceholder: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    padding: 24,
  },
  signatureInfo: {
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  signButton: {
    marginTop: 8,
  },
});