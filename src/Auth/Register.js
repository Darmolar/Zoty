import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, CheckBox, TextInput, ScrollView, Modal, TouchableOpacity, Image } from 'react-native'
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Snackbar } from 'react-native-paper';
 
const { width, height } = Dimensions.get('window');

export default function RegisterScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [ passwordSecure, setPasswordSecure] = useState(true);
  const [ useDetails, setUserDetails ] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    conf_password: '',
    bvn: '', 
  });
  const [ message, setMessage ] = useState('');
  const [visible, setVisible] = useState(false);
 
  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  const checkForm = () => { 
    if(useDetails.firstName == "" ||
       useDetails.lastName == "" ||
       useDetails.email == "" ||
       useDetails.phoneNumber == "" ||
       useDetails.password == "" ||
       useDetails.conf_password == "" ){
        setMessage('All feilds are required'); 
        setVisible(true)
        return false;
    }else if( useDetails.password !== useDetails.conf_password ) {
      setMessage('Password do not match'); 
      setVisible(true)
      return false;
    }else if(!isSelected ) {
      setMessage('Accept terms and condition'); 
      setVisible(true)
      return false;
    }

    navigation.navigate('OTP', { useDetails }) 
  }

  return (
    <View style={styles.container}>
        <View style={styles.body}>
          <Image source={require('../../assets/logo.png')} borderRadius={5} style={{ width: 50, height: 50, alignSelf: 'center' }} />
          <ScrollView style={{  width }} showsVerticalScrollIndicator={false} >
            <View style={styles.form}>
              <Text style={styles.formHeaderText}>Create an account</Text>
              
              <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'flex-start' }}>                  
                <View style={[styles.formGroup, { width: '46%', right: 10 }]}> 
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextInput
                        style={[styles.input, { width: '100%' }]}
                        placeholder="First Name"
                        placeholderTextColor="rgba(32, 10, 77, .5)"
                        value={useDetails.firstName}
                        onChangeText={ value => setUserDetails({ ...useDetails, firstName: value })  }
                    />  
                  </View>
                </View>
                
                <View style={[styles.formGroup, { width: '46%', left: 10 }]}> 
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextInput
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Last Name"
                        placeholderTextColor="rgba(32, 10, 77, .5)"
                        value={useDetails.lastName}
                        onChangeText={ value => setUserDetails({ ...useDetails, lastName: value })  }
                    />  
                  </View>
                </View>
              </View>

              <View style={[styles.formGroup ]}> 
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <TextInput
                      style={[styles.input, { width: '80%' }]}
                      placeholder="Email"
                      placeholderTextColor="rgba(32, 10, 77, .5)"
                      value={useDetails.email}
                      onChangeText={ value => setUserDetails({ ...useDetails, email: value })  }
                  />
                  { 
                     (useDetails.email.includes(".com") || useDetails.email.includes(".com")) &&
                    <Ionicons name="checkmark-circle" size={18} color="rgba(26, 96, 81, 1)" /> 
                  }
                </View>
              </View>

              <View style={styles.formGroup}> 
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <TextInput
                      style={[styles.input, { width: '80%' }]}
                      placeholder="Phone Number"
                      placeholderTextColor="rgba(32, 10, 77, .5)"
                      value={useDetails.phoneNumber}
                      maxLength={11}
                      onChangeText={ value => setUserDetails({ ...useDetails, phoneNumber: value })  }
                  />
                  {
                    useDetails.phoneNumber.length > 10 &&
                    <Ionicons name="checkmark-circle" size={18} color="rgba(26, 96, 81, 1)" />
                  } 
                </View>
              </View>
              
              <View style={{ width: '100%', flexDirection: 'row', marginTop: 0, justifyContent: 'space-between' }}>                    
                <View style={[styles.formGroup, { width: '46%' }]}> 
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextInput
                        style={[styles.input, { width: '80%' }]}
                        placeholder="Password"
                        placeholderTextColor="rgba(32, 10, 77, .5)"  
                        secureTextEntry={passwordSecure}          
                        value={useDetails.password}
                        onChangeText={ value => setUserDetails({ ...useDetails, password: value })  }        
                    /> 
                    <Ionicons name={ passwordSecure ? "md-eye-off-outline" : "md-eye-outline" } size={18} color="grey" onPress={() => setPasswordSecure(!passwordSecure) } />
                  </View>
                </View> 

                <View style={[styles.formGroup, { width: '46%' }]}> 
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                    <TextInput
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Confirm Password"
                        placeholderTextColor="rgba(32, 10, 77, .5)" 
                        secureTextEntry={passwordSecure}             
                        value={useDetails.conf_password}
                        onChangeText={ value => setUserDetails({ ...useDetails, conf_password: value })  }      
                    /> 
                    {/* <Ionicons name="md-eye-outline" size={18} color="grey" /> */}
                  </View>
                </View> 
              </View>

              <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}>
                {/* <Pressable style={{ width: 15, height: 15, borderRadius: 1, borderWidth: .8, borderColor: 'rgba(26, 96, 81, 1)' }} >
                </Pressable> */}
                <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={{ width: 15, height: 15, borderRadius: 1, borderWidth: .8, borderColor: 'rgba(26, 96, 81, 1)' }}
                />
                
                <Text style={{ marginLeft: 20, color: '#000', fontSize: 12, fontFamily: 'Helvetica', justifyContent: 'center' }}>I accept ZOTY’S                 
                  <TouchableOpacity onPress={() => setModalVisible(true) } >
                    <Text style={{  fontSize: 12, top: 5, fontFamily: 'Helvetica-Bold', marginLeft: 10, color: 'rgba(26, 96, 81, 1)' }}> Terms & Policy</Text>
                  </TouchableOpacity>
                </Text>
              </View>

              <Pressable style={styles.button} onPress={() => checkForm() }>
                <LinearGradient colors={['rgba(45, 187, 84, 1)', 'rgba(26, 96, 81, 1)']} style={styles.button}>
                    <Text style={styles.buttonText}>CONTINUE</Text>
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
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}  
            >
              <View style={styles.centeredView} >
                <View style={styles.modalView}> 
                  <EvilIcons name="close" size={24} color="rgba(26, 96, 81, 1)" style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false) } />
                  <Text style={styles.modalText}>Terms and Conditions</Text>
                  <ScrollView showsVerticalScrollIndicator={false} > 
                    <Text style={{ fontSize: 14, textAlign: 'left', fontFamily: 'Helvetica-Regular',  }}>
                        <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: 'rgba(28, 27, 27, 1)' }}>THE AGREEMENT: </Text>
                        The use of this website and services on this website provided by Aftamaat (hereinafter referred to as "Company") 
                        are subject to the following Terms & Conditions (hereinafter the "Agreement"), all parts and sub-parts of which 
                        are specifically incorporated by reference here. This Agreement shall govern the use of all pages on this website 
                        (hereinafter collectively referred to as "Website") and any services provided by or on this Website ("Services").
                    </Text> 

                    <Text style={{ marginTop: 20, textAlign: 'left', fontSize: 14, fontFamily: 'Helvetica-Bold', color: 'rgba(28, 27, 27, 1)' }}>1) DEFINITIONS </Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Regular', }}> The parties referred to in this Agreement shall be defined as follows: </Text>
                    <Text style={{ left: 10, textAlign: 'left', fontSize: 13, fontFamily: 'Helvetica-Regular', }}>a) Company, Us, We: The Company, as the creator, operator, and publisher of the Website, makes the Website, and certain Services on it, available to users. Aftamaat, Company, Us, We, Our, Ours and other first-person pronouns will refer to the Company, as well as all employees and affiliates of the Company. </Text>
                    <Text style={{ left: 10, textAlign: 'left', fontSize: 13, fontFamily: 'Helvetica-Regular', }}>b) You, the User, the Client: You, as the user of the Website, will be referred to throughout this Agreement with second-person pronouns such as You, Your, Yours, or as User or Client. </Text>
                    <Text style={{ left: 10, textAlign: 'left', fontSize: 13, fontFamily: 'Helvetica-Regular', }}>c) Parties: Collectively, the parties to this Agreement (the Company and You) will be referred to as Parties. </Text> 
                    

                    <Text style={{ marginTop: 20, textAlign: 'left', fontSize: 14, fontFamily: 'Helvetica-Bold', color: 'rgba(28, 27, 27, 1)' }}> 2) ASSENT & ACCEPTANCE </Text>
                        <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Regular', }}>
                        By using the Website, You warrant that You have read and reviewed this Agreement and that You agree to be bound by it. 
                        If You do not agree to be bound by this Agreement, please leave the Website immediately. The Company only agrees to provide use of this
                        Website and Services to You if You assent to this Agreement. </Text>
                  </ScrollView>
                </View>
              </View>
            </Modal>
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
  centeredView: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, .7)',
    justifyContent: 'flex-end',
  },
  modalView: {
    width, 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
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
  modalText:{
    fontSize: 20,
    color: 'rgba(26, 96, 81, 1)',
    fontFamily: 'Helvetica-Bold',
    marginVertical: 10
  }

});