import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IconSymbol } from '../../components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockPatientCases, mockRecommendations } from '../../data/mockData';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../contexts/AuthContext';

export default function PrescriptionGenerationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  const { user } = useAuth();
  const patientCase = mockPatientCases.find(c => c.id === id);
  const recommendation = mockRecommendations.find(r => r.caseId === id);

  const [isGenerating, setIsGenerating] = useState(false);

  if (!patientCase || !recommendation) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <Text style={commonStyles.text}>Case or recommendation not found</Text>
      </SafeAreaView>
    );
  }

  const generatePrescriptionHTML = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563EB;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .hospital-name-en {
              font-size: 24px;
              font-weight: 700;
              color: #1F2937;
              margin-bottom: 8px;
            }
            .hospital-name-ar {
              font-size: 20px;
              font-weight: 600;
              color: #6B7280;
              direction: rtl;
            }
            .document-title {
              font-size: 20px;
              font-weight: 700;
              color: #2563EB;
              margin: 20px 0;
              text-align: center;
            }
            .patient-info {
              background: #F9FAFB;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: 600;
              color: #1F2937;
              width: 150px;
            }
            .info-value {
              color: #6B7280;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #1F2937;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #E5E7EB;
            }
            .order-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .order-table th {
              background: #2563EB;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
            }
            .order-table td {
              padding: 12px;
              border: 1px solid #E5E7EB;
              font-size: 14px;
            }
            .order-table tr:nth-child(even) {
              background: #F9FAFB;
            }
            .signature-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #E5E7EB;
            }
            .signature-box {
              display: inline-block;
              margin-top: 10px;
            }
            .signature-line {
              border-top: 2px solid #1F2937;
              width: 250px;
              margin-top: 40px;
            }
            .signature-label {
              font-size: 12px;
              color: #6B7280;
              margin-top: 5px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              font-size: 12px;
              color: #6B7280;
            }
            .qr-placeholder {
              width: 100px;
              height: 100px;
              border: 2px dashed #E5E7EB;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              color: #6B7280;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hospital-name-en">University of Science & Technology Hospital</div>
            <div class="hospital-name-ar">مستشفى جامعة العلوم والتكنولوجيا</div>
          </div>

          <div class="document-title">DOCTOR ORDERS SHEET</div>

          <div class="patient-info">
            <div class="info-row">
              <div class="info-label">Patient Name:</div>
              <div class="info-value">${patientCase.patientName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">File No.:</div>
              <div class="info-value">${patientCase.fileNo}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Age/Gender:</div>
              <div class="info-value">${patientCase.age} years / ${patientCase.gender}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Primary Physician:</div>
              <div class="info-value">${patientCase.primaryPhysician}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${currentDate}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Medical Conditions</div>
            <ul>
              ${patientCase.medicalConditions.map(condition => `<li>${condition}</li>`).join('')}
            </ul>
          </div>

          ${patientCase.allergies.length > 0 ? `
          <div class="section">
            <div class="section-title">⚠️ ALLERGIES</div>
            <ul style="color: #EF4444; font-weight: 600;">
              ${patientCase.allergies.map(allergy => `<li>${allergy}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">PATIENT MANAGEMENT INSTRUCTIONS TO NURSING STAFF</div>
            <table class="order-table">
              <thead>
                <tr>
                  <th>DATE OF ORDER</th>
                  <th>TIME</th>
                  <th>INSTRUCTIONS</th>
                  <th>DOCTOR'S SIGNATURE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${currentDate}</td>
                  <td>${currentTime}</td>
                  <td>${recommendation.advice}</td>
                  <td>
                    <div style="text-align: center;">
                      <div style="font-style: italic; color: #6B7280;">Digitally Signed</div>
                      <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
                        ${new Date().toLocaleString()}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Clinical Pharmacist Review</div>
            <div class="info-row">
              <div class="info-label">Reviewed by:</div>
              <div class="info-value">${recommendation.pharmacistName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Review Date:</div>
              <div class="info-value">${new Date(recommendation.createdAt).toLocaleString()}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Justification:</div>
              <div class="info-value">${recommendation.justification}</div>
            </div>
          </div>

          <div class="signature-section">
            <div style="display: flex; justify-content: space-between;">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Pharmacist Signature</div>
                <div class="signature-label">${recommendation.pharmacistName}</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Doctor's Signature</div>
                <div class="signature-label">${user?.name || patientCase.primaryPhysician}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="qr-placeholder">QR Code</div>
            <div>This document is digitally signed and verified.</div>
            <div>Generated on ${new Date().toLocaleString()}</div>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintPDF = async () => {
    try {
      setIsGenerating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const html = generatePrescriptionHTML();
      const { uri } = await Print.printToFileAsync({ html });

      console.log('PDF generated at:', uri);

      Alert.alert(
        'PDF Generated',
        'Doctor Orders Sheet has been generated successfully.',
        [
          {
            text: 'Share',
            onPress: async () => {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
              }
            },
          },
          {
            text: 'Print',
            onPress: async () => {
              await Print.printAsync({ uri });
            },
          },
          { text: 'Done', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const html = generatePrescriptionHTML();
      await Print.printAsync({ html });
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const html = generatePrescriptionHTML();
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Doctor Orders Sheet',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview Card */}
        <View style={commonStyles.card}>
          <View style={styles.previewHeader}>
            <IconSymbol name="doc.text.fill" size={32} color={colors.primary} />
            <View style={styles.previewHeaderText}>
              <Text style={commonStyles.cardTitle}>Doctor Orders Sheet</Text>
              <Text style={commonStyles.textSecondary}>Ready for generation</Text>
            </View>
          </View>
        </View>

        {/* Document Preview */}
        <View style={[commonStyles.card, styles.documentPreview]}>
          <View style={styles.documentHeader}>
            <Text style={styles.hospitalNameEn}>
              University of Science & Technology Hospital
            </Text>
            <Text style={styles.hospitalNameAr}>
              مستشفى جامعة العلوم والتكنولوجيا
            </Text>
          </View>

          <Text style={styles.documentTitle}>DOCTOR ORDERS SHEET</Text>

          <View style={styles.patientInfoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Patient Name:</Text>
              <Text style={styles.infoValue}>{patientCase.patientName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>File No.:</Text>
              <Text style={styles.infoValue}>{patientCase.fileNo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age/Gender:</Text>
              <Text style={styles.infoValue}>
                {patientCase.age}y / {patientCase.gender}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Primary Physician:</Text>
              <Text style={styles.infoValue}>{patientCase.primaryPhysician}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>PATIENT MANAGEMENT INSTRUCTIONS</Text>
            <View style={styles.orderBox}>
              <Text style={commonStyles.text}>{recommendation.advice}</Text>
            </View>
          </View>

          <View style={styles.signaturePreview}>
            <Text style={commonStyles.textSecondary}>
              ✓ Digitally signed by {user?.name || patientCase.primaryPhysician}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {new Date().toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Document Actions</Text>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.actionButton]}
            onPress={handlePrintPDF}
            disabled={isGenerating}
            activeOpacity={0.7}
          >
            <IconSymbol name="doc.fill" size={20} color={colors.card} />
            <Text style={[buttonStyles.buttonText, styles.buttonTextWithIcon]}>
              {isGenerating ? 'Generating...' : 'Generate PDF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondary, styles.actionButton]}
            onPress={handlePrint}
            activeOpacity={0.7}
          >
            <IconSymbol name="printer.fill" size={20} color={colors.card} />
            <Text style={[buttonStyles.buttonText, styles.buttonTextWithIcon]}>
              Print Document
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.outline, styles.actionButton]}
            onPress={handleShare}
            disabled={isGenerating}
            activeOpacity={0.7}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
            <Text style={[buttonStyles.outlineText, styles.buttonTextWithIcon]}>
              Share Document
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.accent} />
          <View style={styles.infoCardText}>
            <Text style={commonStyles.text}>
              This document is white-labeled with your hospital&apos;s branding and includes
              digital signatures for compliance.
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
              The generated PDF can be printed or shared securely with nursing staff and pharmacy.
            </Text>
          </View>
        </View>
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
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  previewHeaderText: {
    flex: 1,
  },
  documentPreview: {
    backgroundColor: colors.card,
    padding: 20,
  },
  documentHeader: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 16,
    marginBottom: 16,
  },
  hospitalNameEn: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  hospitalNameAr: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 16,
  },
  patientInfoSection: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
    color: colors.text,
    width: 140,
    fontSize: 14,
  },
  infoValue: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 14,
  },
  orderSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  orderBox: {
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  signaturePreview: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  actionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  buttonTextWithIcon: {
    marginLeft: 0,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
  },
  infoCardText: {
    flex: 1,
  },
});