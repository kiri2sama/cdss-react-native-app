import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IconSymbol } from '../components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import * as Haptics from 'expo-haptics';

export default function SignatureCaptureScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { caseId, type } = route.params as { caseId: string; type: string };
  const [hasSignature, setHasSignature] = useState(false);

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHasSignature(false);
    console.log('Signature cleared');
  };

  const handleSave = () => {
    if (!hasSignature) {
      Alert.alert('No Signature', 'Please provide your signature before saving');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Alert.alert(
      'Signature Saved',
      'Your digital signature has been captured successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Signature saved for case:', caseId, 'type:', type);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSimulateSignature = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHasSignature(true);
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="pencil.tip.crop.circle" size={48} color={colors.primary} />
          <Text style={commonStyles.subtitle}>Sign Below</Text>
          <Text style={commonStyles.textSecondary}>
            {type === 'pharmacist'
              ? 'Pharmacist Digital Signature'
              : 'Doctor Digital Signature'}
          </Text>
        </View>

        <View style={styles.canvasContainer}>
          <View style={[styles.canvas, hasSignature && styles.canvasWithSignature]}>
            {!hasSignature ? (
              <View style={styles.canvasPlaceholder}>
                <IconSymbol name="hand.draw" size={64} color={colors.textSecondary} />
                <Text style={[commonStyles.textSecondary, { marginTop: 16 }]}>
                  Tap below to simulate signature
                </Text>
              </View>
            ) : (
              <View style={styles.signaturePreview}>
                <Text style={styles.signatureText}>
                  {type === 'pharmacist' ? 'Pharmacist Signature' : 'Doctor Signature'}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {new Date().toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Simulate signature button for demo */}
          {!hasSignature && (
            <TouchableOpacity
              style={[buttonStyles.outline, styles.simulateButton]}
              onPress={handleSimulateSignature}
              activeOpacity={0.7}
            >
              <Text style={buttonStyles.outlineText}>Simulate Signature (Demo)</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoBox}>
          <IconSymbol name="info.circle" size={20} color={colors.accent} />
          <Text style={[commonStyles.textSecondary, { flex: 1 }]}>
            Your signature will be encrypted and stored securely. It will be used for
            legal compliance and verification purposes.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[buttonStyles.outline, styles.actionButton]}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow.counterclockwise" size={20} color={colors.primary} />
            <Text style={[buttonStyles.outlineText, styles.buttonTextWithIcon]}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.actionButton]}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
            <Text style={[buttonStyles.buttonText, styles.buttonTextWithIcon]}>
              Save Signature
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>
            By signing, you confirm that you have reviewed all information and approve
            this {type === 'pharmacist' ? 'evaluation' : 'recommendation'}.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  canvasContainer: {
    flex: 1,
    marginBottom: 24,
  },
  canvas: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 300,
  },
  canvasWithSignature: {
    borderStyle: 'solid',
    borderColor: colors.success,
    backgroundColor: colors.card,
  },
  canvasPlaceholder: {
    alignItems: 'center',
  },
  signaturePreview: {
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  simulateButton: {
    marginTop: 16,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonTextWithIcon: {
    marginLeft: 0,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});