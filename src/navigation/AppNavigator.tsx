import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import PharmacistDashboard from '../screens/pharmacist/PharmacistDashboard';
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import PatientEvaluationScreen from '../screens/pharmacist/PatientEvaluationScreen';
import DoctorReviewScreen from '../screens/doctor/DoctorReviewScreen';
import PrescriptionGenerationScreen from '../screens/prescription/PrescriptionGenerationScreen';
import SignatureCaptureScreen from '../screens/SignatureCaptureScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PharmacistTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={PharmacistDashboard} />
      <Tab.Screen name="Evaluations" component={PatientEvaluationScreen} />
    </Tab.Navigator>
  );
}

function DoctorTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DoctorDashboard} />
      <Tab.Screen name="Reviews" component={DoctorReviewScreen} />
      <Tab.Screen name="Prescriptions" component={PrescriptionGenerationScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="SignatureCapture" component={SignatureCaptureScreen} />
            {user.role === 'pharmacist' && (
              <Stack.Screen name="PharmacistTabs" component={PharmacistTabNavigator} options={{ headerShown: false }} />
            )}
            {user.role === 'doctor' && (
              <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} options={{ headerShown: false }} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}