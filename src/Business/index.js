import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, Image } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function BusinessHomeScreen({navigation}) {
  return (
    <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>          
            <Pressable onPress={() => navigation.goBack() } >
                <Text style={styles.bodyH1}> <MaterialIcons name="arrow-back-ios" size={20} color="rgba(45, 187, 84, 1)" /> Back to Home</Text>
            </Pressable>
        </View>
        <View style={styles.body}>
            <ScrollView  showsVerticalScrollIndicator={false} style={{ marginTop: 50, }}>
                <Text style={styles.h1}>Become a</Text>
                <Text style={[styles.h1, { bottom: 10 }]}>Vendor</Text>

                <Image source={require('../../assets/imgs/business.png')} style={{ width, zIndex: 10,  }} />

                <Text style={styles.h2}>As a vendor, you can exchange currency for individuals who needs to change their currency E.g. Dollars to Naira</Text>
                
                <Pressable style={styles.button} onPress={() => navigation.navigate('BusinessCompleteRegisterThree') }>
                    <Text style={styles.buttonText}>Yes, I want to be a Vendor</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="#fff" />
                </Pressable>
                
                <View style={{ width: '80%', marginVertical: 10, borderWidth: .4, borderColor: 'rgba(45, 187, 84, 1)', height: 1, alignSelf: 'center' }}></View>
                <Text style={{ fontSize: 12, color: 'rgba(45, 187, 84, 1)', fontFamily: 'Helvetica-Regular', alignSelf: 'center' }}>
                    ZOTY’S <Text style={{ fontSize: 12, color: 'rgba(45, 187, 84, 1)', fontFamily: 'Helvetica-Bold' }}>Terms & Policy </Text>
                </Text>

            </ScrollView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,   
  }, 
  header:{
    paddingLeft: 30, 
    marginTop: 60,
  },
  body:{
    width: '100%', 
    bottom: '5%' 
  },
  bodyH1:{
    fontSize: 20, 
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(45, 187, 84, 1)',
    justifyContent: 'center'
  },
  h1:{
    fontSize: 35, 
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(45, 187, 84, 1)',
  },
  h2:{
    width: '80%',
    fontSize: 15, 
    textAlign: 'center',
    fontFamily: 'Helvetica',
    color: 'rgba(89, 92, 91, 1)',
    alignSelf: 'center', 
  },
  button:{
    width: '80%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 187, 84, 1)',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText:{
    fontSize: 14,  
    fontFamily: 'Helvetica-Regular',
    color: 'rgba(255, 255, 255, 1)',
  }
});