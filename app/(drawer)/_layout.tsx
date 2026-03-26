import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import { Colors } from '@/constants/theme';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWindowDimensions } from 'react-native';

const DRAWER_MAX_WIDTH = 420;

export default function DrawerLayout() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const { width: winW } = useWindowDimensions();
  const drawerWidth = Math.min(DRAWER_MAX_WIDTH, Math.round(winW * 0.88));

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        sceneStyle: { flex: 1, backgroundColor: c.backgroundTop },
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: c.backgroundTop,
        },
        overlayColor: 'rgba(10, 22, 40, 0.45)',
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: () => null,
          title: 'Main',
        }}
      />
      <Drawer.Screen name="profile" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="settings" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="privacy" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="app-info" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="about" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="service/[id]" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}
