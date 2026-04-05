import {NativeModules} from 'react-native';

const {SafeVoiceModule} = NativeModules;

export default {
  startMonitoring: async () => {
    return SafeVoiceModule.startMonitoring();
  },
  stopMonitoring: async () => {
    return SafeVoiceModule.stopMonitoring();
  },
};