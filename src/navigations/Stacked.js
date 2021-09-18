import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { createStackNavigator } from '@react-navigation/stack';

import IndexScreen from '../Auth/Index'; 
import LoginScreen from '../Auth/Login';
import RegisterScreen from '../Auth/Register';
import ResetScreen from '../Auth/Reset';
import ResetPasswordScreen from '../Auth/ResetPassword';

import OTPScreen from '../Auth/OTP'; 
import VerificationScreen from '../Auth/Verification';

import PaymentScreen from '../Payment';
import ResponseScreen from '../Response';

import ProfileScreen from '../Profile';
import EditProfileScreen from '../EditProfile';
import LevelScreen from '../Level';

import SearchScreen from '../Search'; 

//Business Page
import BusinessHomeScreen from '../Business/index';
import BusinessRegisterScreen from '../Business/Register';
import BusinessCompleteRegisterScreen from '../Business/CompleteRegistration';
import BusinessCompleteRegisterThreeScreen from '../Business/Register_3';
import BusinessResponseScreen from '../Business/Response';

import MyTabs from './Tabs';

const Stack = createStackNavigator();

export default function MyStack() {
  const [ alreadyHere, SetALreadyHere ] = useState(false);
  const [  loading, setLoading ] = useState(true)

  useEffect(() => {
    _checkUser();
    setLoading(true);
  }, [])

  const _checkUser = async () => {
    var checkUser = await SecureStore.getItemAsync('alreadyHere');
    console.log('checkUser', checkUser)
    SetALreadyHere(checkUser)
    setLoading(false);
  }

  if(loading){
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={ alreadyHere == 'yes' ? "MyTabs" : "IndexScreen"} >
      <Stack.Screen name="IndexScreen" component={IndexScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="Register" component={RegisterScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="OTP" component={OTPScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="Reset" component={ResetScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}  options={{ headerShown : false }} />      
      <Stack.Screen name="Verification" component={VerificationScreen}  options={{ headerShown : false }} />
      
      <Stack.Screen name="Search" component={SearchScreen}  options={{ headerShown : false }} />

      <Stack.Screen name="Payment" component={PaymentScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="Response" component={ResponseScreen}  options={{ headerShown : false }} />
       
      <Stack.Screen name="Profile" component={ProfileScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="Level" component={LevelScreen}  options={{ headerShown : false }} />
       
      <Stack.Screen name="BusinessHome" component={BusinessHomeScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="BusinessCompleteRegisterThree" component={BusinessCompleteRegisterThreeScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="BusinessCompleteRegister" component={BusinessCompleteRegisterScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen}  options={{ headerShown : false }} />
      <Stack.Screen name="BusinessResponse" component={BusinessResponseScreen}  options={{ headerShown : false }} />
      
      <Stack.Screen name="MyTabs" component={MyTabs}  options={{ headerShown : false }} />
    </Stack.Navigator>
  );
}