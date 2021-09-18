import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, TochableOpcaity, Modal, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Snackbar } from 'react-native-paper';
import { live_url } from '../Network';

const { width, height } = Dimensions.get('window');

export default function ResetScreen({navigation}) {
  
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ submitting, setSubmitting] = useState(false);
  
  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  const [ useDetails, setUserDetails ] = useState({
                                                  email: '', 
                                                });
  
  const resetUser = async ()=> {
    setSubmitting(true) 
    fetch(`${live_url}forgotPassword`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: useDetails.email, 
        })
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        navigation.navigate('ResetPassword');
        // if(json.responseCode == "00"){ 
        //   navigation.navigate('ResetPasswordScreen');
        // }else{
        //   setMessage(json.responseMessage); 
        //   setVisible(true) 
        // }
      })
      .catch(error => console.error(error))
      .finally(res => setSubmitting(false))  
  }
  return (
    <View style={styles.container}> 
        <View style={styles.body}>
          <Image source={require('../../assets/logo.png')} borderRadius={5} style={{ width: 50, height: 50, alignSelf: 'center' }} />
          <View style={{  width }} >
            <View style={styles.form}>
              <Text style={styles.formHeaderText}>Reset password</Text> 
              <View style={[styles.formGroup ]}> 
                <TextInput
                    style={[styles.input, { width: '100%' }]}
                    placeholder="Email or Phone Number"
                    placeholderTextColor="rgba(32, 10, 77, .5)"
                    value={useDetails.email}
                    onChangeText={ value => setUserDetails({ ...useDetails, email: value })  }  
                />   
              </View>  
              <Pressable style={styles.button} onPress={() => resetUser() }>
                <LinearGradient colors={['rgba(45, 187, 84, 1)', 'rgba(26, 96, 81, 1)']} style={styles.button}> 
                    {
                      submitting
                      ?
                        <ActivityIndicator size="small" color="#fff" />
                      :
                        <Text style={styles.buttonText}>RESET</Text> 
                    }
                </LinearGradient> 
              </Pressable> 
              <Pressable style={{ marginTop: 10 }} onPress={() =>  navigation.navigate('Login') }>
                <Text style={[styles.formHeaderText, { fontSize: 13 } ]}>Already have an account? Sign in</Text>
              </Pressable>

            </View>
          </View>
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
  }
});