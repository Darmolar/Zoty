import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ResponseScreen({navigation, route}) {
  const [ response, setResponse ] = useState(route.params.details);


  return (
    <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ width: '50%', alignItems: 'center' }}>
            <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 25, fontFamily: 'Helvetica-Bold' }}>Success</Text>
            {/* <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', }}>{ response.responseMessage }</Text> */}
            <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 15, textAlign: 'center', fontFamily: 'Helvetica-Regular', marginTop: 30, }}>
              You have initiated a money exchange process. Your order will be delivered soon. Please check your notification often…. </Text>
            <Text style={{ color: 'rgba(45, 187, 84, 1)', fontSize: 13, textAlign: 'center', fontFamily: 'Helvetica', marginTop: 15, }}>
             Thank you for choosing ZOTY!
            </Text>
        </View> 
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('History') }>
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(22, 29, 111, 1)', justifyContent: 'center' }}>Track Order 
                <Ionicons name="md-chevron-forward" size={15} color="rgba(22, 29, 111, 1)" /> 
              </Text> 
          </Pressable>
        
          <Pressable style={[styles.button, { backgroundColor: 'rgba(45, 187, 84, 1)' }]} onPress={() => navigation.navigate('MyTabs') }>
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(255, 255, 255, 1)' }}>Continue
                <Ionicons name="md-chevron-forward" size={15} color="#fff" /> 
              </Text> 
          </Pressable>
        </View>
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
    width: '70%',
    height: 60,
    backgroundColor: 'rgba(255, 193, 79, 1)',
    borderRadius: 30,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
});