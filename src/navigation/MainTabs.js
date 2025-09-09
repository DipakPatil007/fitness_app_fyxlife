import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/main/DashboardScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import RiskOMeterScreen from '../screens/main/RiskOMeterScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Progress') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Risk') {
                        iconName = focused ? 'warning' : 'warning-outline';
                    }
                    return <Ionicons name={iconName} color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
            <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
            <Tab.Screen name="Risk" component={RiskOMeterScreen} options={{ title: 'Risk-o-Meter' }} />
        </Tab.Navigator>
    );
}
