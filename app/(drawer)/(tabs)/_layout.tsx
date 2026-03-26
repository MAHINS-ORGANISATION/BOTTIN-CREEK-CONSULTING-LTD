import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { OrderTabBarIcon } from '@/components/OrderTabBarIcon';
import { Colors, Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONTENT_MIN_HEIGHT = 52;

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { flex: 1, backgroundColor: c.backgroundTop },
        tabBarActiveTintColor: Palette.brass,
        tabBarInactiveTintColor: c.tabIconDefault,
        tabBarStyle: {
          backgroundColor: c.backgroundElevated,
          borderTopColor: c.border,
          height: TAB_CONTENT_MIN_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          overflow: 'visible',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'DMSans_500Medium',
          fontWeight: '500',
        },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Order',
          tabBarIcon: ({ color, size }) => <OrderTabBarIcon color={color} size={size ?? 24} />,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size }) => <Ionicons name="mail-outline" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
