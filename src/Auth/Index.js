import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

const { width, height } = Dimensions.get('window'); 

export default function IndexScreen({navigation}) {
    const slides = [
        {
            key: 'one',
            title: 'Easy Currency Exchange',
            text: 'Change your currency easily with no stress',
            image: require('../../assets/a1.png'),
            backgroundColor: '#59b2ab',
        },
        {
            key: 'two',
            title: 'Secure Transaction',
            text: 'Our app is secured with 256-bit SSL encryption', 
            image: require('../../assets/a2.png'),
            backgroundColor: '#febe29',
        },
        {
            key: 'three',
            title: 'Best Exchange Rate', 
            text: 'We give best exchange rates you can\'t get anywhere ',
            image: require('../../assets/a3.png'),
            backgroundColor: '#22bcb5',
        },
        {
            key: 'four',
            title: 'Become a Vendor', 
            text: 'Generate income by becoming a vendor and selling different currency',
            image: require('../../assets/a4.png'),
            backgroundColor: '#22bcb5',
        }
    ];  

    const _renderItem = ({ item }) => {
        return (
          <View style={styles.slideContainer}>
            <Image style={styles.slideImage} resizeMode="cover" source={item.image} />
            <Text style={styles.slidetitle}>{item.title}</Text>
            <Text style={styles.slidetext}>{item.text}</Text>  
            <TouchableOpacity onPress={ async() =>{ await SecureStore.setItemAsync('alreadyHere', 'yes'); navigation.navigate('Login') }} style={{ width: '100%', alignItems: 'center' }} >
                <LinearGradient 
                    colors={[ '#1A6051', '#2DBB54' ]}
                    start={{ x: 0.7, y: 0.2 }}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </LinearGradient>
            </TouchableOpacity>     
          </View>
        );
    }

    const _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons
                    name="arrow-forward"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };

    const _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons
                    name="md-checkmark"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };

    const _onDone = async () => { 
        await SecureStore.setItemAsync('alreadyHere', 'yes');
        navigation.navigate('Login');
    }

    return (
        <AppIntroSlider 
            renderItem={_renderItem} 
            renderDoneButton={_renderDoneButton}
            renderNextButton={_renderNextButton}
            data={slides} 
            dotStyle={{ width: 10, height: 5, backgroundColor: 'grey' }}
            activeDotStyle={{ width: 20, height: 5, backgroundColor: '#1A6051' }}
            onDone={_onDone}
        />
    );

}

const styles = StyleSheet.create({
    slideContainer:{
        flex: 1,
        width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }, 
    slideImage:{
        width: '80%',
        height: 300,
        marginVertical: 30,
    },
    slidetitle:{
        fontSize: 25,
        fontFamily: 'Helvetica-Bold',
        color: '#000',
        width: '100%',
        textAlign: 'center',
    },
    slidetext:{
        fontSize: 14,
        fontFamily: 'Helvetica',
        color: '#000',
        width: '60%',
        textAlign: 'center',
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 50
    },
    buttonText:{
        fontSize: 15,
        fontFamily: 'Helvetica-Bold',
        color: '#fff'
    }
});