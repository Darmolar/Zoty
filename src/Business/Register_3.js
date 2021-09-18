import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import * as DocumentPicker from 'expo-document-picker';
import { Button, Snackbar } from 'react-native-paper';
import { live_url } from '../Network';

const { width, height } = Dimensions.get('window');

export default function BusinessCompleteRegisterThreeScreen({navigation}) {
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({}); 
  const [ userDoc, setUserDoc ] = useState({}); 
  const [ businessDetails, setBusinessDetails ] = useState({
    "businessName": '',
    "businessCategory": '',
    "businessField": '',
    "email": '',
    "location": '',
    "maximumExchangeAmount": '',
    "minimumExchangeAmount": '',
    "primaryCurrency": '',
    "role": "Vendor",
    "document": '',
    "packages": [],
  }); 
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ submitting, setSubmitting] = useState(false);
   
  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  useEffect(() => {
    setLoading(true);
    getUserDetails(); 
    setBusinessDetails({ ...businessDetails, email: userDetails.email })
  }, []);

  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user)); 
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 

  const pickDoc = async () => {
    let data = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory : true,
      multiple: false,
    })
    if(data.type != "cancel"){
      setUserDoc(data);
      setBusinessDetails({ ...businessDetails, document: data.uri })
    }
  }

  const moveToNext = async () => {
    if( businessDetails.businessName == "" || 
        businessDetails.businessField == "" ||
        businessDetails.email == "" ||  
        businessDetails.location == "" || 
        businessDetails.document == ""  || 
        businessDetails.businessCategory == ""
        ){
      setMessage('All feilds are required'); 
      setVisible(true); 
      return false; 
    } 
    navigation.navigate('BusinessCompleteRegister', { businessDetails })
  }
  
  if(loading){
    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#000" size="large" />
      </View>
    )
  }
  return (
    <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.body}>
            <Pressable onPress={() => navigation.goBack() } >
                <Text style={styles.bodyH1}> <MaterialIcons name="arrow-back-ios" size={20} color="rgba(45, 187, 84, 1)" /> Back to Home</Text>
            </Pressable>
            <ScrollView style={{ marginTop: 20, }} showsVerticalScrollIndicator={false} > 
                <Text style={styles.h1}>Register as a</Text>
                <Text style={[styles.h1, { bottom: 10 }]}>Vendor</Text>

                <View style={{ width: '100%' }}>

                    <Text style={[styles.label, { marginVertical: 10, }]}>What Currency are you able to change</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Business Name</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '100%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)" 
                                value={businessDetails.businessName}
                                onChangeText={ value => setBusinessDetails({ ...businessDetails, businessName: value })  }
                            />  
                        </View>
                    </View> 
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Business Email</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '100%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)" 
                                value={userDetails.email}  
                                editable={false}
                            />  
                        </View>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Business Category</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '100%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)" 
                                value={businessDetails.businessCategory}
                                onChangeText={ value => setBusinessDetails({ ...businessDetails, businessCategory: value })  }
                            />  
                        </View>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Location</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '100%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)"
                                value={businessDetails.location}
                                onChangeText={ value => setBusinessDetails({ ...businessDetails, location: value })  } 
                            />  
                        </View>
                    </View>
                    {/* <View style={styles.formGroup}>
                        <Text style={styles.label}>Role</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '100%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)" 
                                value={businessDetails.email}
                                onChangeText={ value => setBusinessDetails({ ...businessDetails, email: value })  }
                            />  
                        </View>
                    </View> */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Field / Industry</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '100%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)" 
                                value={businessDetails.businessField}
                                onChangeText={ value => setBusinessDetails({ ...businessDetails, businessField: value })  }
                            />  
                        </View>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Upload Business Document</Text>
                        <View style={{ width: '100%', height: 40, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <TextInput 
                                style={[styles.input, { width: '83.5%' }]}
                                placeholder=""
                                placeholderTextColor="rgba(37, 50, 116, 0.6)"
                                value={userDoc.name} 
                                editable={false}
                            />  
                            <Pressable  onPress={() => pickDoc() } style={{ width: '20%', height: 40, backgroundColor: '#2DBB54', justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="camera-plus" size={24} color="#fff" />
                            </Pressable>
                        </View>
                    </View>

                </View> 
                <Text style={[styles.label, { top: 10, fontFamily: 'Helvetica', fontSize: 13 }]}>You are one step away from being a vendor</Text>
                <Pressable style={styles.button} onPress={() => moveToNext() } >
                    <Text style={styles.buttonText}>Continue</Text> 
                </Pressable> 

            </ScrollView>
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
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,  
    padding: 30,
    alignItems: 'center'
  }, 
  body:{
    width: '100%',
    marginTop: 50,
  },
  bodyH1:{
    fontSize: 20, 
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(45, 187, 84, 1)',
    justifyContent: 'center'
  },
  h1:{
    fontSize: 30, 
    textAlign: 'left',
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(45, 187, 84, 1)',
  },
  h2:{
    width: '80%',
    fontSize: 18, 
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(89, 92, 91, 1)',
    alignSelf: 'center',
    marginVertical: 20
  },
  button:{
    width: '100%',
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 187, 84, 1)',
    alignSelf: 'center', 
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText:{
    fontSize: 14,  
    fontFamily: 'Helvetica-Regular',
    color: 'rgba(255, 255, 255, 1)',
  }, 
  formGroup:{
    width: '100%',
    height: 40,
    justifyContent: 'space-between',
    marginVertical: 15
  },
  label:{
    color: 'rgba(37, 50, 116, 0.6)',
    fontSize: 15,
    bottom: 10,
    fontFamily: 'Helvetica-Regular',
  },
  input:{
    width: '100%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 5,
    padding: 5,
    color: 'rgba(37, 50, 116, 0.6)',
    fontSize: 13
  },
});