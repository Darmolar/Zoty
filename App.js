import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

import MyStack from './src/navigations/Stacked';

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}   
 

export default function App() {
  const [ isReady, setIsReady ] = useState(false); 
  const [ appLoading, setAppLoading ] = useState(false);

  useEffect(() => {
    setAppLoading(false);
    const NLTimeout = setTimeout(() => {
      setAppLoading(false);
    }, 2000); 
  },[]) 
  
  _loadAssetsAsync = async () => {
      // const imageAssets = cacheImages([
      //     require('./assets/bg_logo.png'),
      // ]); 
      const fontAssets = cacheFonts([ 
        { 'Helvetica': require('./assets/fonts/Helvetica.ttf')  },
        { 'Helvetica-Bold': require('./assets/fonts/Helvetica-Bold.ttf')  },
        { 'Helvetica-Regular': require('./assets/fonts/Helvetica-Regular.ttf')  },  

      ]);
      await Promise.all([ ...fontAssets]);
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_loadAssetsAsync}
        onFinish={() => { setAppLoading(true); setIsReady(true)}}
        onError={console.warn}
      />
    );
  } 

  if(appLoading && isReady){
    return(
      <ImageBackground source={require('./assets/splash_2.png')} resizeMode="cover" style={{ flex: 1 }}></ImageBackground>
    )
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );

}  