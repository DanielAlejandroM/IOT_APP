import { NativeModules } from 'react-native';

const { SafeVoiceModule } = NativeModules;

export default {
  startMonitoring: async (strToken: string) => {
    return SafeVoiceModule.startMonitoring(strToken);
  },

  stopMonitoring: async () => {
    return SafeVoiceModule.stopMonitoring();
  },
};