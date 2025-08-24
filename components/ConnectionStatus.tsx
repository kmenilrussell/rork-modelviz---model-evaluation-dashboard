import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isConnecting 
}) => {
  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Wifi size={16} color={COLORS.success} />
          <Text style={[styles.text, styles.connectedText]}>Live</Text>
        </>
      ) : isConnecting ? (
        <>
          <Wifi size={16} color={COLORS.warning} />
          <Text style={[styles.text, styles.connectingText]}>Connecting...</Text>
        </>
      ) : (
        <>
          <WifiOff size={16} color={COLORS.error} />
          <Text style={[styles.text, styles.disconnectedText]}>Offline</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  connectedText: {
    color: COLORS.success,
  },
  connectingText: {
    color: COLORS.warning,
  },
  disconnectedText: {
    color: COLORS.error,
  },
});

export default ConnectionStatus;