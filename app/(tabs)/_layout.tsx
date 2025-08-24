import { Tabs } from "expo-router";
import { BarChart3, List } from "lucide-react-native";
import React from "react";

import { COLORS } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.card,
        },
        headerTitleStyle: {
          color: COLORS.text,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="models"
        options={{
          title: "Models",
          tabBarIcon: ({ color }) => <List color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}