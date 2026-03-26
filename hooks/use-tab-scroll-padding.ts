import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Spacing } from '@/constants/theme';

/** Bottom padding for tab screens so scroll content clears the tab bar (and system gesture area). */
export function useTabScrollPaddingBottom(extra = Spacing.xxl) {
  const tabBarHeight = useBottomTabBarHeight();
  return extra + tabBarHeight;
}
