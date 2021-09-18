
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, Image, Switch, Modal, ActivityIndicator } from 'react-native'
import { Ionicons, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Button, Snackbar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function MoreScreen({navigation}) {
  const [ securityVisible, setSecurityVisible ] = useState(false);
  const [ verificationVisible, setVerificationVisible ] = useState(false); 
  const [ paymentType, setPaymentType ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ isEnabled, setIsEnabled ] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState); 
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});
  const [ passwordDetails, setPasswordDetails ] = useState({
    oldPassword: '',
    newPassword: '',
    confNewPassword: '',
  });
  const [ myBVN, setBVN ] = useState('0');

  useEffect(() => { 
    const unsubscribe = navigation.addListener('focus', () => { 
      setLoading(true);
      getUserDetails();
    }); 
    return unsubscribe; 
  }, [navigation])

  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user));
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 
  
  const updatePassword = async () => { 
    if( passwordDetails.oldPassword == "" || passwordDetails.newPassword == "" || passwordDetails.confNewPassword == "" ){
      setMessage('All feilds are required'); 
      setVisible(true)
      return false;
    }else if(passwordDetails.newPassword !== passwordDetails.confNewPassword ){
      setMessage('Password do not match'); 
      setVisible(true)
      return false;
    }

    setLoading(true)
    fetch(`${live_url}updatePassword`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userDetails.email,
              oldPassword: passwordDetails.oldPassword,
              newPassword: passwordDetails.newPassword,
              sessionId: userDetails.sessionId
            })
          })
      .then(response => response.json())
      .then(async(json) => {
        console.log(json);
        if(json.responseCode == "00"){ 
          setMessage(json.responseMessage); 
          setVisible(true)
          setSecurityVisible(false);
          setPasswordDetails({})
        }else{
          alert(json.responseMessage); 
          // setVisible(true)
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  const sendBVN = async () => { 
    if( myBVN == "" ){
      setMessage('BVN are required'); 
      setVisible(true)
      return false;
    }   
    setLoading(true)
    fetch(`${live_url}verifyBvn`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userDetails.email, 
              sessionId: userDetails.sessionId,
              bvn: myBVN,
            })
          })
      .then(response => response.json())
      .then(async(json) => {
        console.log(json);
        if(json.responseCode == "00"){ 
          setMessage(json.responseMessage); 
          setVisible(true)
          setSecurityVisible(false);
          setBVN('0');
        }else{
          alert('Invalid BVN.');  
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  return (
    <View style={styles.container}>
       <StatusBar style="light" />
       <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.nav}>  
              <AntDesign name="left" size={20} color="#fff" style={{ left: 20, }} />
              <Text style={styles.navText}>Settings</Text>
              <Text></Text>
          </Pressable>  
       </View>
       <View style={styles.body}> 
          <View style={styles.bodyCard}>
              <View style={styles.bodyCardHeader}>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('EditProfile') } >
                  <Image source={userDetails.base64Pic ?  { uri: 'data:image/jpg;base64,'+userDetails.base64Pic } : require('../assets/avartar.png') } style={{ width: 40, height: 40, borderRadius: 40, }} />
                  <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', left: 10 }}>{userDetails.firstName} {userDetails.lastName}</Text>
                </Pressable>
              </View> 
              <View style={styles.bodyCardBody}>
                  <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', left: 10, color: '#ADADAD' }}>Settings</Text>
                  <Pressable style={styles.buttonNav} onPress={() => navigation.navigate('EditProfile') }>
                    <AntDesign name="user" size={18} color="black" />
                    <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#000000', right: '70%' }}>Profile</Text>
                    <AntDesign name="right" size={15} color="black" />
                  </Pressable>
                  <Pressable style={styles.buttonNav} onPress={() => setSecurityVisible(true)}> 
                    <MaterialCommunityIcons name="cellphone-lock" size={18} color="black" />
                    <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#000000', right: '70%' }}>Security</Text>
                    <AntDesign name="right" size={15} color="black" />
                  </Pressable>
                  <Pressable style={styles.buttonNav}  onPress={() => setVerificationVisible(true)}>
                    <Ionicons name="checkmark-done" size={18} color="black" />
                    <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#000000', right: '70%' }}>Verification</Text>
                    <AntDesign name="right" size={15} color="black" />
                  </Pressable>
                  <Pressable style={styles.buttonNav} onPress={() => navigation.navigate('Level') } > 
                    <MaterialIcons name="bar-chart" size={18} color="black" />
                    <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#000000', right: '70%' }}>Level</Text>
                    <AntDesign name="right" size={15} color="black" />
                  </Pressable>
                  {/* <Pressable style={styles.buttonNav}> 
                    <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#000000' }}>Dark mode</Text>
                    <Switch
                        trackColor={{ false: 'rgba(0, 0, 0, 0.4)', true: 'rgba(0, 0, 0, 0.4)' }}
                        thumbColor={isEnabled ? 'rgba(45, 187, 84, 1)' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      />
                  </Pressable> */}
              </View>
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
            visible={securityVisible}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                  onPress={() => setSecurityVisible(false)}
                  style={[styles.buttonClose]} 
                > 
              </Pressable>
              <Text style={styles.modalText}>Password Change</Text>
              <View style={styles.form}>  
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Old Password</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="********************"
                        // secureTextEntry={true}
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                        value={passwordDetails.oldPassword}
                        onChangeText={val => setPasswordDetails({ ...passwordDetails , oldPassword: val }) }
                    />
                    <Pressable onPress={() => navigation.navigate('Reset') }>
                      <Text style={[styles.label ,{  fontSize: 12, textAlign: 'right', marginTop: 15 }]}>Forgot Password?</Text>
                    </Pressable>
                </View>
                
                <View style={styles.formGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="********************"
                        // secureTextEntry={true}
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                        value={passwordDetails.newPassword}
                        onChangeText={val => setPasswordDetails({ ...passwordDetails , newPassword: val }) }
                    />
                </View>
                
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Retype Password</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="********************"
                        // secureTextEntry={true}
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                        value={passwordDetails.confNewPassword}
                        onChangeText={val => setPasswordDetails({ ...passwordDetails , confNewPassword: val }) }
                    />
                </View>

                <Pressable style={styles.button} onPress={() => updatePassword() } >
                  {
                    loading ?
                      <ActivityIndicator color="#fff" />
                    :
                      <Text style={styles.buttonText}>Save</Text>
                  }
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
            animationType="slide"
            transparent={true} 
            visible={verificationVisible}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                  onPress={() => setVerificationVisible(false)}
                  style={[styles.buttonClose]} 
                > 
              </Pressable>
              <Text style={styles.modalText}>Verification</Text>
              <View style={styles.form}>  
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Enter BVN</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="1234567890" 
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                        keyboardType="number-pad"
                        value={myBVN}
                        maxLength={10}
                        onChangeText={val => setBVN(val) }
                    />
                    <Text style={[styles.label , {  fontSize: 12, textAlign: 'right', marginTop: 15 }]}>Why do we need your BVN?  </Text>
                </View>
                 
                <Pressable style={styles.button} onPress={() => sendBVN() }> 
                    {
                    loading ?
                      <ActivityIndicator color="#fff" />
                    :
                      <Text style={styles.buttonText}>Save BVN</Text>
                  }
                </Pressable>
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
  }, 
  header:{
    flex: .6,
    width,
    padding: 30,
    backgroundColor: 'rgba(45, 187, 84, 1)',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  nav:{
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navText:{
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  body:{
    flex: 3.4,
    width,
  },    
  bodyCard:{
    width: '80%',
    height: '150%',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    marginTop: -40,
    alignSelf: 'center',
  },
  bodyCardHeader:{
    height: '10%',
    width: '100%',
    borderBottomWidth: .5,
    borderColor: 'grey', 
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  bodyCardBody:{
    height: '90%',
    width: '100%', 
    padding: 20, 
  },
  buttonNav:{
     width: '100%',
     height: '9%',
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: 10,
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
  modalText: { 
    textAlign: "center",
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginTop: 10,
  },
  form:{
    width: '80%',
    alignItems: 'center', 
    alignSelf: 'center',
    marginTop: 30
  },
  formGroup:{
    width: '100%',
    height: 80,
    justifyContent: 'space-between',
    marginVertical: 15
  },
  label:{
    color: 'rgba(37, 50, 116, 1)',
    fontSize: 14,
    bottom: 10,
    fontFamily: 'Helvetica',
  },
  input:{
    width: '100%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .09)',
    borderRadius: 5,
    padding: 5,
    color: 'rgba(37, 50, 116, 0.6)',
    fontSize: 13
  },
  button:{
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 187, 84, 1)',
    borderRadius: 5,
    marginVertical: 10
  },
  buttonText:{
    color: '#fff',
    fontSize: 15, 
    fontFamily: 'Helvetica-Regular',
  }
});