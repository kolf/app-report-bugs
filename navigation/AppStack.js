import * as React from 'react';
import { Image, StatusBar } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, AllListScreen, MyListScreen, CreateStep1Screen, CreateStep2Screen, DetailsScreen } from '../screens';

import { Icons } from "../config/images";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} options={{
        // headerShown: false,
        tabBarLabel: '首页',
        title: '首页',
        tabBarActiveTintColor: '#000000',
        tabBarIcon: ({ size, focused }) => {
          return <Image name="home" source={focused ? Icons.tab1Active : Icons.tab1} style={{ width: size * 1.2, height: size * 1.2 }} />
        },
      }} />
      <Tab.Screen name='MyList' component={MyListScreen} options={{
        // headerShown: false,
        tabBarLabel: '我的上报',
        title: '我的上报',
        tabBarActiveTintColor: '#000000',
        tabBarIcon: ({ size, focused }) => {
          return <Image name="home" source={focused ? Icons.tab3Active : Icons.tab3} style={{ width: size * 1.2, height: size * 1.2 }} />
        },
      }} />
      <Tab.Screen name='AllList' component={AllListScreen} options={{
        // headerShown: false,
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
    <Stack.Navigator>
      <Stack.Screen name='Tab' options={{ title: '智慧病虫害', headerShown: false }} component={TabStack} />
      <Stack.Screen name='CreateStep1' options={{ title: '天气物候', }} component={CreateStep1Screen} />
      <Stack.Screen name='CreateStep2' options={{ title: '监测数据采集' }} component={CreateStep2Screen} />
      <Stack.Screen name='Details' options={{ title: '上报详情' }} component={DetailsScreen} />
    </Stack.Navigator>
  );
};
