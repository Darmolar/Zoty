import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, TochableOpcaity, Modal, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Snackbar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { live_url } from '../Network';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({navigation}) {
  const [ fringerPrintVisible, setfringerPrintVisible ] = useState(false);
  const [ secure, setSecure ] = useState(true);
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ submitting, setSubmitting] = useState(false);
  
  useEffect(() => { 
    setSubmitting(false)
  },[])

  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  const [ useDetails, setUserDetails ] = useState({
                                                  email: '',
                                                  password: '',
                                                });

  const loginUser = async ()=> { 
    if( useDetails.email == "" || useDetails.password == "" ){
      setMessage('All feilds are required'); 
      setVisible(true)
      return false;
    }

    setSubmitting(true)
    fetch(`${live_url}loginUser`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: useDetails.email,
                password: useDetails.password
            })
          })
      .then(response => response.json())
      .then(async(json) => { 
        if(json.responseCode == "00"){ 
          await SecureStore.deleteItemAsync('user_details');
          await SecureStore.setItemAsync('user_details', JSON.stringify(json));
          // navigation.navigate('MyTabs', { screen: 'Home' });
          navigation.reset({
            index: 0,
            routes: [{ name: "MyTabs" }],
          });
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
       <StatusBar style="dark" /> 
        <View style={styles.body}>
          <Image source={require('../../assets/logo.png')} borderRadius={5} style={{ width: 50, height: 50, alignSelf: 'center' }} />
          <View style={styles.form}>
            <Text style={styles.formHeaderText}>Sign in to your account</Text>
            

            <View style={[styles.formGroup, { marginTop: 40, }]}> 
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="rgba(32, 10, 77, .5)"
                    value={useDetails.email}
                    onChangeText={ value => setUserDetails({ ...useDetails, email: value })  }
                 />
                 { 
                   (useDetails.email.includes(".com") || useDetails.email.includes(".com"))  &&
                   <Ionicons name="checkmark-circle" size={15} color="rgba(26, 96, 81, 1)" style={{ right: 20 }} /> 
                 } 
              </View>
            </View>

            <View style={styles.formGroup}> 
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <TextInput
                    style={[styles.input, { width: '70%' }]}
                    placeholder="Password"
                    placeholderTextColor="rgba(32, 10, 77, .5)"
                    secureTextEntry={secure}  
                    value={useDetails.password}
                    onChangeText={ value => setUserDetails({ ...useDetails, password: value })  }                 
                 /> 
                <Ionicons name={ secure ? "md-eye-off-outline" : "md-eye-outline" } size={18} color="grey" onPress={() => setSecure(!secure) } />
              </View>
            </View>
            <Pressable style={{ width: '100%', alignItems: 'flex-end', }} onPress={() => navigation.navigate('Reset') }>
              <Text style={{ color: 'rgba(32, 10, 77, 0.6)', fontSize: 14, fontFamily: 'Helvetica-Regular', }}>Forgot Password?</Text>
            </Pressable> 
 
            <Pressable style={styles.button} onPress={() => loginUser() } >
              <LinearGradient colors={['rgba(45, 187, 84, 1)', 'rgba(26, 96, 81, 1)']} style={styles.button}> 
                {
                  submitting
                  ?
                    <ActivityIndicator size="small" color="#fff" />
                  :
                    <Text style={styles.buttonText}>PROCEED</Text> 
                  }
              </LinearGradient> 
            </Pressable>
            
            {/* <Ionicons name="finger-print-outline" size={30} color="black" onPress={() => setfringerPrintVisible(true)} /> */}

            <Pressable style={{ marginTop: 20 }} onPress={() => navigation.navigate('Register') }>
              <Text style={[styles.formHeaderText, { fontSize: 13 } ]}>Don’t have an account? Sign up</Text>
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
        <Modal
            animationType="slide"
            transparent={true} 
            visible={fringerPrintVisible}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                  onPress={() => setfringerPrintVisible(false)}
                  style={[styles.buttonClose]} 
                > 
              </Pressable>
              <Text style={styles.modalText}>Use your finger to login</Text>
              <View style={styles.form2}>    
                
                <Ionicons name="finger-print-outline" size={70} color="black" onPress={() => navigation.navigate('MyTabs') } />

              </View>
            </View>
          </View>
        </Modal>

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
      color: 'rgba(32, 10, 77, 1)',
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
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center", 
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: { 
      width: '100%',
      padding: 10,
      backgroundColor: "white",
      borderRadius: 20, 
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    }, 
    buttonClose: {
      backgroundColor: "#9B9B9B",
      width: '50%',
      height: 8,
      borderRadius: 5,
    },  
    modalText:{
      fontSize: 20,
      marginTop: 20,
      fontFamily: 'Helvetica',
    },
    form2:{
      width: '100%',
      height: 200,
      alignItems: 'center', 
      justifyContent: 'center', 
    },
});