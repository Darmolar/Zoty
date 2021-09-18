import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { Button, Snackbar } from 'react-native-paper';
import SelectBox from 'react-native-multi-selectbox'
import { live_url } from '../Network';
import { xorBy } from 'lodash'

const { width, height } = Dimensions.get('window');

export default function BusinessRegisterScreen({navigation, route}) {  
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({}); 
  const [ businessDetails, setBusinessDetails ] = useState(route.params.businessDetails);
  const [ packages, setPackages ] = useState([]); 
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ submitting, setSubmitting] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([])
   
  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  useEffect(() => {
    setLoading(true);
    setSubmitting(false);
    getUserDetails();
    getPackages(); 
    setSelectedTeams([]);
    setBusinessDetails({...businessDetails, packages : [] });
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

  const getPackages = async ()=> {   
    setLoading(true);
    fetch(`${live_url}getPackages`,{
            method: 'GET', 
          })
      .then(response => response.json())
      .then((json) => {
        // console.log(json); 
        if(json.length > 0){ 
          json.forEach(element => {
            element['item'] = element.description;
          }); 
          setPackages(json);
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }  

  // const onMultiChange = () => {
  //   return (item) => { businessDetails.packages.push({ id: item.id }); setSelectedTeams(xorBy(selectedTeams, [item], 'id'))};  
  // }
  
  // const onSelectMultiChange = () => {
  //   // return (item) => { businessDetails.packages.push(item); };  
  // } 

  const moveToNext = async () => {
    if( businessDetails.primaryCurrency == "" ){
      setMessage('All feilds are required'); 
      setVisible(true);  
      return false;
    } 

    const document_uri = "file:///" + businessDetails.document.split("file:/").join("");
    var document_uri_file = { 
                                uri : document_uri,
                                type: 'image/jpeg',
                                name: document_uri.split("/").pop()
                            }   
    
    var BusinessData = new FormData; 
    BusinessData.append('sessionId', userDetails.sessionId);
    BusinessData.append('businessName', businessDetails.businessName);
    BusinessData.append('businessCategory', businessDetails.businessCategory);
    BusinessData.append('businessField', businessDetails.businessField);
    BusinessData.append('email', businessDetails.email);
    BusinessData.append('maximumExchangeAmount', businessDetails.maximumExchangeAmount);
    BusinessData.append('minimumExchangeAmount', businessDetails.minimumExchangeAmount); 
    BusinessData.append('primaryCurrency', businessDetails.primaryCurrency);
    BusinessData.append('location', businessDetails.location);
    BusinessData.append('role', 'Vendor');
    BusinessData.append('document', document_uri_file ); 


    // businessDetails.packages.map((item, index) => { 
    //   BusinessData.append('packages[]', item);
    // })


    console.log(BusinessData);
    setSubmitting(true)
    fetch(`${live_url}createVendor`,{
            method: 'POST', 
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data;'
            },
            body: BusinessData
          })
      .then(response => response.json())
      .then(async(json) => {
        console.log(json);
        if(json.responseCode == "00"){ 
          setMessage(json.responseMessage); 
          setVisible(true)
          // await SecureStore.setItemAsync('user_details', JSON.stringify(json));
          navigation.navigate('BusinessResponse', { data: json }); 
        }else{
          setMessage(json.responseMessage); 
          setVisible(true)
        }
      })
      .catch(error => console.error(error))
      .finally(res => setSubmitting(false))  
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
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50, }}> 
                <Text style={styles.h1}>Register as a</Text>
                <Text style={[styles.h1]}>Vendor</Text>

                <View style={{ marginTop: 20, width: '100%', alignSelf: 'center' }}>
                    {/* <View style={styles.formGrou}>
                        <Text style={styles.label}>Choose Program</Text>
                        <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                            <SelectBox
                                label="Select multiple"
                                options={packages}
                                selectedValues={selectedTeams}
                                onMultiSelect={onMultiChange()}
                                onTapClose={onSelectMultiChange()}
                                arrowIconColor='rgba(45, 187, 84, .6)'
                                searchIconColor='rgba(45, 187, 84, .6)'
                                toggleIconColor='rgba(45, 187, 84, .6)'
                                multiOptionContainerStyle={{ backgroundColor: 'rgba(45, 187, 84, .6)', fontFamily: 'Helvetica', }}
                                isMulti
                              />
                        </View> 
                    </View> */}
                    
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Choose the Currencies you want</Text>
                        <Picker 
                            style={[styles.input, { width: '100%' }]}
                            mode="dropdown"  
                            selectedValue={businessDetails.primaryCurrency}
                            onValueChange={(itemValue, itemIndex) =>
                              { setBusinessDetails({ ...businessDetails, primaryCurrency: itemValue }) }
                          }> 
                          {
                            packages.length > 0 &&
                            packages.map((item, index) => (
                              <Picker.Item key={index} label={ item.fromCurrency } value={ item.fromCurrency } />
                            ))
                          }
                        </Picker>
                    </View>

                </View>
                <Pressable style={styles.button} onPress={() => moveToNext() }>
                  {
                    submitting
                    ?
                      <ActivityIndicator color="#fff" size="small" />
                    :
                    <Text style={styles.buttonText}>Continue</Text> 
                  }
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