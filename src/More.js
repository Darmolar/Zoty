import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Pressable, TextInput, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign, MaterialCommunityIcons, MaterialIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Button, Snackbar } from 'react-native-paper'; 
import * as WebBrowser from 'expo-web-browser';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({navigation}) {
  const [ helpVisible, setHelpVisible ] = useState(false);
  const [ sudgestVisible, setSudgestVisible ] = useState(false);  
  const [ sudgest, setSudgest ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});  
  const [ adminMessage, setAdminMessage ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ isEnabled, setIsEnabled ] = useState(userDetails.activeInd); 
  
  useEffect(() => { 
    getUserDetails();
    const unsubscribe = navigation.addListener('focus', () => { 
        getUserDetails();
    }); 
    return unsubscribe; 
  }, [navigation]) 

  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  const _handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync('http://173.248.130.123:8090/ZotyAdmin/faq');
  };

  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user)); 
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 

  const logout = async () => {
    await SecureStore.deleteItemAsync('user_details'); 
    // navigation.navigate('Login');
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  const sendMessage = async ()=> { 
    if( message == ""  ){
      setMessage('All feilds are required'); 
      setVisible(true);
      return false;
    }  
    setLoading(true)
    fetch(`${live_url}mailAdmin`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userDetails.email, 
              sessionId: userDetails.sessionId,
              message: adminMessage,
            })
          })
      .then(response => response.json()) 
      .then(async(json) => { 
        if(json.responseCode == "00"){ 
          setHelpVisible(false);
          setAdminMessage('');
          setMessage(json.responseMessage); 
          setVisible(true);
        }else{
          setAdminMessage('');
          setMessage(json.responseMessage); 
          setVisible(true);
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  const sendSudgest = async ()=> { 
    if(sudgest == ""){
      setMessage('All feilds are required'); 
      setVisible(true);
      return false;
    }  
    setLoading(true)
    fetch(`${live_url}suggestToAdmin`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userDetails.email, 
              sessionId: userDetails.sessionId,
              message: sudgest,
            })
          })
      .then(response => response.json())
      .then(async(json) => { 
        if(json.responseCode == "00"){ 
          setSudgestVisible(false);
          setSudgest('');
          setMessage(json.responseMessage); 
          setVisible(true);
        }else{
          setMessage(json.responseMessage); 
          setVisible(true);
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  const toggleSwitch = async ()=> {  
    setLoading(true)
    fetch(`${live_url}vendorActiveIndicator`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailAddress: userDetails.email,  
                activeInd: userDetails.activeInd == 1 ? 0 : 1
            })
          })
      .then(response => response.json())
      .then(async(json) => {  
        if(json.responseCode == "00"){   
            userDetails.activeInd = json.activeInd;  
            await SecureStore.deleteItemAsync('user_details');  
            await SecureStore.setItemAsync('user_details', JSON.stringify(userDetails));   
            setIsEnabled(!isEnabled);
            getUserDetails();
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  return (
    <View style={styles.container}>
        <StatusBar style="light" />
        <Pressable onPress={() => navigation.navigate('EditProfile') } style={styles.profileCard}> 
            <Image source={userDetails.base64Pic ?  { uri: 'data:image/jpg;base64,'+userDetails.base64Pic } : require('../assets/avartar.png') } style={{ width: 60, height: 60, borderRadius: 10, zIndex: 1, right: '30%' }} />
            <View>
                <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#fff', right: '5%' }}>{userDetails.firstName} {userDetails.lastName}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Regular', color: '#fff', right: '5%' }}>{userDetails.email}</Text>
            </View>
        </Pressable> 
          
        <View style={styles.bodyCardBody}>  
          <View style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
             <Switch
                trackColor={{ false: 'grey', true: 'rgba(13, 172, 57, 1)' }}
                thumbColor={isEnabled ? '#fff' : '#fff'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Helvetica-Bold', }}> Available </Text>
          </View>
          <Pressable style={styles.buttonNav} onPress={() => navigation.navigate('Home') }> 
              <MaterialIcons name="home-filled" size={15} color="#fff" style={{ width: '15%' }}  />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Home</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable> 
          <Pressable style={styles.buttonNav}  onPress={() => navigation.navigate('Vendor') }>  
              <Feather name="users"  size={15} color="#fff" style={{ width: '15%' }}  />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Vendors</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable> 
          <Pressable style={styles.buttonNav}  onPress={() => navigation.navigate('History') }>  
              <MaterialIcons name="history"  size={15} color="#fff" style={{ width: '15%' }}   />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Transaction History</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable> 
          <Pressable style={styles.buttonNav}  onPress={() => navigation.navigate('Profile') }>  
              <MaterialIcons name="settings"  size={15} color="#fff" style={{ width: '15%' }}   />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Settings</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable> 
          {
            userDetails.userTypeInd == 1 &&
            <Pressable style={styles.buttonNav}  onPress={() => navigation.navigate('BusinessHome') } >  
                <AntDesign name="adduser"  size={15} color="#fff" style={{ width: '15%' }} />
                <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Register as a Vendor</Text>
                <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
            </Pressable>  
          }
          <Pressable style={styles.buttonNav}  onPress={() => setHelpVisible(true)}>  
              <AntDesign name="questioncircle" size={15} color="#fff" style={{ width: '15%' }}  />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Help</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable> 
          <Pressable style={styles.buttonNav}  onPress={() => setSudgestVisible(true)}>  
              <MaterialCommunityIcons name="lightbulb-on" size={15} color="#fff" style={{ width: '15%' }} />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Suggest to Us</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable> 
          <Pressable style={styles.buttonNav} onPress={() => logout() } >  
              <SimpleLineIcons name="logout" size={15} color="#fff" style={{ width: '15%' }} />
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', color: '#fff', width: '75%' }}>Logout</Text>
              <AntDesign name="right" size={15} color="#fff" style={{ width: '10%' }} />
          </Pressable>   
        </View>

        <Modal
            animationType="slide"
            transparent={true} 
            visible={sudgestVisible}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                  onPress={() => setSudgestVisible(false)}
                  style={[styles.buttonClose]} 
                > 
              </Pressable>
              <Text style={styles.modalText}>Suggest to Us</Text>
              <View style={styles.form}>    
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tell us what you’ll like us to add</Text> 
                    <TextInput 
                        style={[styles.input, { width: '100%', height: 200, }]}
                        placeholder=" "
                        secureTextEntry={true}
                        multiline={true}
                        value={sudgest}
                        onChangeText={val => setSudgest(val) }
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                    />  
                </View>
 
                <Pressable style={styles.button} onPress={() => sendSudgest() }>
                    {
                    loading ?
                        <ActivityIndicator color="#fff" />
                      :
                        <Text style={styles.buttonText}>Send</Text>
                    } 
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true} 
            visible={helpVisible}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                  onPress={() => setHelpVisible(false)}
                  style={[styles.buttonClose]} 
                > 
              </Pressable>
              <Text style={styles.modalText}>Help</Text>
              <Text style={styles.modalText2}>How can we help you?</Text>
              <View style={styles.form}>    
                <View style={styles.formGroup}>
                    <View style={{ flexDirection: 'row', bottom: 25, justifyContent: 'space-evenly',  }}>
                        <Pressable style={styles.box}  onPress={() => _handlePressButtonAsync()} > 
                            <AntDesign name="bars" size={30} color="#2DBB54" />
                            <Text style={styles.boxText}>FAQ</Text>
                        </Pressable>
                        <View style={styles.box}>  
                            <MaterialCommunityIcons name="whatsapp"  size={30} color="#2DBB54" />
                            <Text style={styles.boxText}>Chat us on whatsapp</Text>
                        </View>
                    </View>
                    <Text style={[styles.label, { textAlign: 'center' }]}>OR send a direct message to us</Text> 
                    <TextInput 
                        style={[styles.input, { width: '100%', height: 70, }]}
                        placeholder=" "
                        secureTextEntry={true}
                        multiline={true}
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                        value={adminMessage}
                        onChangeText={val => setAdminMessage(val) }
                    />  
                </View>

                <Pressable style={styles.button} onPress={() => sendMessage() }>
                    {
                    loading ?
                        <ActivityIndicator color="#fff" />
                      :
                        <Text style={styles.buttonText}>Send</Text>
                    } 
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    alignItems: 'center', 
    backgroundColor: 'rgba(45, 187, 84, .9)',
    padding: 20
  }, 
  profileCard:{
    width: '70%',
    height: 70,
    backgroundColor: 'rgba(13, 172, 57, 1)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
  }, 
  bodyCardBody:{
    height: '90%',
    width: '100%', 
    padding: 20, 
    marginTop: '10%'
  },
  buttonNav:{
    width: '100%',
    height: '9  %',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: .4,
    borderColor: '#fff'
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
  modalText2:{ 
    textAlign: "center",
    fontSize: 15, 
    fontFamily: 'Helvetica-Regular',
    color: '#000'
  },
  form:{
    width: '80%',
    alignItems: 'center', 
    alignSelf: 'center',
    marginTop: 30
  },
  formGroup:{
    width: '100%',
    // height: 50,
    justifyContent: 'space-between',
    marginVertical: 15
  },
  label:{
    color: 'rgba(37, 50, 116, 0.6)',
    fontSize: 14,
    bottom: 10,
    fontFamily: 'Helvetica-Regular',
  },
  input:{
    width: '100%',
    height: 40,
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
    height: 40,
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
  },
  box:{
      width: '35%',
      height: 70,
      backgroundColor: '#fff',
      elevation: 5,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
  },
  boxText:{  
    textAlign: 'center', 
    fontSize: 8, 
    fontFamily: 'Helvetica',
  }
}); 