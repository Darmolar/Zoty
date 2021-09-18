import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, ImageBackground, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Snackbar } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input'; 
import { live_url } from '../Network';

const { width, height } = Dimensions.get('window');

export default function VerificationScreen({navigation, route}) { 
  const [ useDetails, setUserDetails ] = useState(route.params.useDetails);
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ submitting, setSubmitting] = useState(false);
   
  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };
    
  const verifyUser = async ()=> {
    setSubmitting(true)
    console.log(useDetails);
    
    fetch(`${live_url}verifyToken`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: useDetails.email,
                token: useDetails.token
            })
          })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            if(json.responseCode == "00"){
                setMessage(json.responseMessage); 
                setVisible(true);
                navigation.navigate('Login') 
            }else{
              setMessage(json.responseMessage); 
              setVisible(true)
            }
          })
          .catch(error => console.error(error))
          .finally(res => setSubmitting(false))  
  }
  return (
    <View style={styles.container}> 
        <View style={styles.body}>
          <ScrollView style={{  width }} showsVerticalScrollIndicator={false} >
            <View style={styles.form}>
              <Text style={styles.formHeaderText}>Sign Up Verification</Text> 
              <View style={[styles.formGroup ]}>
                <Text style={styles.label}>Enter OTP sent to your mail</Text>
                <View style={{  marginTop: 20 }}>
                  <OTPInputView 
                      pinCount={6} 
                      autoFocusOnLoad
                      codeInputFieldStyle={styles.underlineStyleBase}
                      codeInputHighlightStyle={styles.underlineStyleHighLighted} 
                      onCodeFilled = {(code) => {
                        setUserDetails({ ...useDetails, token: code }) 
                      }}
                    /> 
               </View>  
              </View>  
                
              <Pressable disabled={!useDetails.token} style={styles.button} onPress={() => verifyUser() }>
                <LinearGradient colors={['rgba(45, 187, 84, 1)', 'rgba(26, 96, 81, 1)']} style={styles.button}>
                    {
                      submitting
                      ?
                        <ActivityIndicator size="small" color="#fff" />
                      :
                        <Text style={styles.buttonText}>VERIFY</Text> 
                    }
                </LinearGradient> 
              </Pressable>

              <Pressable style={{ marginTop: 10 }} onPress={() => navigation.navigate('Login') }>
                <Text style={[styles.formHeaderText, { fontSize: 13 } ]}>Already have an account? Sign in</Text>
              </Pressable>

            </View>
          </ScrollView>
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
              label: 'Close',
              onPress: () => {
                onDismissSnackBar()
              },
            }}>
            { message }
          </Snackbar>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  }, 
  body:{
    flex: 1,
    width, 
    marginTop: 50,
  },
  form:{
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  formHeaderText:{
    color: 'rgba(26, 96, 81, 1)',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
  },
  formGroup:{
    height: 50,
    width: '100%', 
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 10, 
  },
  label:{
    color: 'rgba(32, 10, 77, .5)',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  input:{
    width: '100%',
    height: 50,
    justifyContent: 'center',
    bottom: 10,
    color: '#000',
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
  }, 
  button:{
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center', 
    marginVertical: 30,
    borderRadius: 5,
    borderBottomRightRadius: 0,
  },
  buttonText:{ 
      fontSize: 15,
      color: 'rgba(255, 255, 255, 1)',
      fontFamily: 'Helvetica-Bold',
  },
  underlineStyleBase: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(45, 187, 84, 1)',
    color: '#fff',
    borderRadius: 10,
  }, 
  underlineStyleHighLighted: {
    borderColor: "rgba(45, 187, 84, 1)",  
  },
});