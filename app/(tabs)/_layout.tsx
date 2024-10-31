import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSegments, useRouter } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated here
    const isAuthenticated = false; // This will be replaced with actual auth check

    // Add a small delay to ensure root layout is mounted
    const timer = setTimeout(() => {
      if (isLoading) {
        // Show splash screen
        router.replace('/');
      } else if (!isAuthenticated) {
        // Not authenticated, redirect to auth flow
        router.replace('../');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
