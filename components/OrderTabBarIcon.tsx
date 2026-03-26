import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useCart } from '@/context/CartContext';

type Props = {
  color: string;
  size?: number;
};

export function OrderTabBarIcon({ color, size = 24 }: Props) {
  const { totalQuantity } = useCart();
  const showBadge = totalQuantity > 0;
  const label = totalQuantity > 99 ? '99+' : String(totalQuantity);

  return (
    <View style={styles.wrap}>
      <Ionicons name="clipboard-outline" size={size} color={color} />
      {showBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: Palette.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Palette.navy,
    fontSize: 10,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 12,
  },
});
