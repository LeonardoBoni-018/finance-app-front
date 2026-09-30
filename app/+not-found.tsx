import React from 'react';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 18, color: '#6B6B64', textAlign: 'center' }}>
        Página não encontrada
      </Text>
    </View>
  );
}