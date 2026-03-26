import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  children: React.ReactNode;
  /** Applied to the content layer above the gradient (e.g. safe-area padding). */
  contentStyle?: ViewStyle;
};

/**
 * Vertical canvas gradient behind screen content. Parent should be flex:1; use transparent
 * backgrounds on inner views so this shows through.
 */
export function AppScreenCanvas({ children, contentStyle }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <View style={styles.fill}>
      <LinearGradient
        colors={[c.backgroundTop, c.backgroundBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.fill, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
