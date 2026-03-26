import { Spacing } from '@/constants/theme';

/**
 * Bottom padding for tab scroll content. The tab navigator lays out the scene above the tab bar,
 * so we only add a small inset so the last item is not flush against the layout edge.
 */
export function useTabScrollPaddingBottom() {
  return Spacing.lg;
}
