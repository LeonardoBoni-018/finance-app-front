import React from 'react';
import { View, ViewStyle, TouchableOpacity, Animated, Easing } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme/tokens';

export interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
  visible?: boolean;
  testID?: string;
}

export const FAB = ({
  onPress,
  icon,
  style,
  visible = true,
  testID,
}: FABProps) => {
  const fadeAnim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const scaleAnim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200, friction: 20 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const opacity = fadeAnim;
  const transform = [{ scale: scaleAnim }];

  if (!visible && fadeAnim._value === 0) return null;

  return (
    <Animated.View style={{ opacity, transform, pointerEvents: visible ? 'auto' : 'none' }}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            position: 'absolute',
            bottom: 24,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadow.fab,
            zIndex: 100,
          },
          style,
        ]}
        activeOpacity={0.85}
        accessibilityLabel="Nova transação"
        testID={testID}
      >
        {icon || <View style={{ width: 24, height: 24 }} />}
      </TouchableOpacity>
    </Animated.View>
  );
};