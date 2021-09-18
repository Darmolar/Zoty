import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Rect, Defs, Pattern, G, } from 'react-native-svg';
import { live_url } from '../Network';

const { width, height } = Dimensions.get('window');

export default function BusinessResponseScreen({navigation}) {

  const logout = async () => {
    await SecureStore.deleteItemAsync('user_details'); 
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ width: '50%', alignItems: 'center' }}> 
            <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 25, fontFamily: 'Helvetica-Bold' }}>Congratulations!</Text>
            <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 15, textAlign: 'center', fontFamily: 'Helvetica-Regular', marginTop: 30, }}>
                You have successfully completed your registration as a vendor
            </Text> 
        </View>
       
        <Pressable style={styles.button} onPress={() => navigation.navigate('BusinessHome') }>
            <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(255, 255, 255, 1)' }}>Proceed </Text> 
            <Ionicons name="arrow-forward-sharp" size={20} color="#fff" />
        </Pressable>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center', 
  },  
  button:{
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(45, 187, 84, 1)',
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
});