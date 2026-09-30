import React from 'react';
import { View, Text, TextStyle } from 'react-native';

export interface IconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const HomeIcon = ({ size = 24, color = '#16A34A', filled = false }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color, lineHeight: size * 0.9 }}>🏠</Text>
  </View>
);

export const ReceiptIcon = ({ size = 24, color = '#16A34A', filled = false }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color, lineHeight: size * 0.9 }}>📝</Text>
  </View>
);

export const BellIcon = ({ size = 24, color = '#16A34A', filled = false }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color, lineHeight: size * 0.9 }}>🔔</Text>
  </View>
);

export const WalletIcon = ({ size = 24, color = '#16A34A', filled = false }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color, lineHeight: size * 0.9 }}>💳</Text>
  </View>
);

export const Plus = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 1.2, color, fontWeight: '700', lineHeight: size * 1.2 }}>+</Text>
  </View>
);