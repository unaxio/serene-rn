import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useConnectUnreadCount } from '@/src/features/connect/hooks/useConnectUnread';
import { formatUnreadBadge } from '@/src/features/connect/utils/formatUnreadBadge';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

const TAB_ICON_SIZE = 22;

interface TabLabelProps {
  label: string;
  color: string;
}

function TabLabel({ label, color }: TabLabelProps) {
  return (
    <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const connectBadge = formatUnreadBadge(useConnectUnreadCount());

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: true,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: Platform.OS === 'web' ? styles.tabBarWeb : undefined,
        tabBarIconStyle: styles.tabIcon,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '探索',
          headerShown: false,
          tabBarLabel: ({ color }) => <TabLabel label="探索" color={color} />,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'safari',
                android: 'explore',
                web: 'explore',
              }}
              tintColor={color}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="square"
        options={{
          title: '广场',
          headerShown: false,
          tabBarLabel: ({ color }) => <TabLabel label="广场" color={color} />,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person.3',
                android: 'groups',
                web: 'groups',
              }}
              tintColor={color}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: '花园',
          headerShown: false,
          tabBarLabel: ({ color }) => <TabLabel label="花园" color={color} />,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'leaf',
                android: 'eco',
                web: 'eco',
              }}
              tintColor={color}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: '连接',
          headerShown: false,
          tabBarBadge: connectBadge,
          tabBarLabel: ({ color }) => <TabLabel label="连接" color={color} />,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'link',
                android: 'link',
                web: 'link',
              }}
              tintColor={color}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          headerShown: false,
          tabBarLabel: ({ color }) => <TabLabel label="我的" color={color} />,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person.circle',
                android: 'person',
                web: 'person',
              }}
              tintColor={color}
              size={TAB_ICON_SIZE}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWeb: {
    minHeight: 58,
    height: 'auto',
    paddingTop: 4,
    paddingBottom: 6,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  tabIcon: {
    marginBottom: 0,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
    textAlign: 'center',
    // 避免 Web 上默认行盒把中文底部裁掉
    includeFontPadding: false,
  },
});
