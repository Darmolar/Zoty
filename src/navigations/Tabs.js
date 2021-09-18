import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../Home';
import HistoryScreen from '../History';
import VendorScreen from '../Vendor';
import MoreScreen from '../More';

const Tab = createBottomTabNavigator();

import MyTabBar from './Icons';

export default function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vendor" component={VendorScreen} />  
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="More" component={MoreScreen} />    
    </Tab.Navigator>
  );
}