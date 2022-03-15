import * as React from 'react';
import { Image, StatusBar } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { HomeScreen, AllListScreen, MyListScreen, CreateStep1Screen, CreateStep2Screen } from '../screens';

import { Icons } from "../config/images";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} options={{
        tabBarLabel: '地图',
        title: '地图',
        tabBarActiveTintColor: '#000000',
        tabBarIcon: ({ size, focused }) => {
          return <Image name="home" source={focused ? Icons.tab1Active : Icons.tab1} style={{ width: size * 1.2, height: size * 1.2 }} />
        },
      }} />
      <Tab.Screen name='MyList' component={MyListScreen} options={{
        tabBarLabel: '我的上报',
        title: '我的上报',
        tabBarActiveTintColor: '#000000',
        tabBarIcon: ({ size, focused }) => {
          return <Image name="home" source={focused ? Icons.tab3Active : Icons.tab3} style={{ width: size * 1.2, height: size * 1.2 }} />
        },
      }} />
      <Tab.Screen name='AllList' component={AllListScreen} options={{
        tabBarLabel: '历史上报',
        title: '历史上报',
        tabBarActiveTintColor: '#000000',
        tabBarIcon: ({ size, focused }) => {
          return <Image name="home" source={focused ? Icons.tab2Active : Icons.tab2} style={{ width: size, height: size }} />
        },
      }} />
    </Tab.Navigator>
  );
}

export const AppStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Tab' component={TabStack} />
      <Stack.Screen name='CreateStep1' component={CreateStep1Screen} />
      <Stack.Screen name='CreateStep2' component={CreateStep2Screen} />
    </Stack.Navigator>
  );
};
