import * as React from 'react';
import { Image, StatusBar } from "react-native";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native-ui-lib'
import { MapScreen, AllListScreen, MyListScreen, CreateStep1Screen, CreateStep2Screen, DetailsScreen } from '../screens';

import { Icons } from "../config/images";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const headerTitle = {
  headerTitleAlign: 'center',
  tabBarActiveTintColor: '#000000',
}

const tabs = [{ name: 'Home', title: '首页', component: MapScreen }, { name: 'MyList', title: '我的上报', component: MyListScreen }, { name: 'AllList', title: '历史上报', component: AllListScreen }]

const getHeaderTitle = (route) => {
  return getFocusedRouteNameFromRoute(route) || "首页";
}

const TabStack = () => {
  return (
    <Tab.Navigator>
      {tabs.map((tab, index) => <Tab.Screen key={tab.name} name={tab.name} component={tab.component} options={{
        ...headerTitle,
        tabBarLabel: tab.title,
        title: tab.title,
        params: { index },
        tabBarIcon: ({ size, focused }) => {
          return <Image source={focused ? Icons[`tab${index + 1}Active`] : Icons[`tab${index + 1}`]} style={{ width: size * 1.2, height: size * 1.2 }} />
        },
      }} />)}
    </Tab.Navigator>
  );
}

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Tab' options={(route) => ({ title: getHeaderTitle(route), headerShown: false })} component={TabStack} />
      <Stack.Screen name='CreateStep1' options={{ title: '天气物候', headerTitleAlign: 'center' }} component={CreateStep1Screen} />
      <Stack.Screen name='CreateStep2' options={{ title: '监测数据采集', headerTitleAlign: 'center' }} component={CreateStep2Screen} />
      <Stack.Screen name='Details' options={{ title: '上报详情', headerTitleAlign: 'center' }} component={DetailsScreen} />
    </Stack.Navigator>
  );
};
