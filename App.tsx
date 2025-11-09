import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { CDSSProvider } from './src/contexts/CDSSContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <CDSSProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </CDSSProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
