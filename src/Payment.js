import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { Button, Snackbar } from 'react-native-paper';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function PaymentScreen({navigation, route}) {
  const [ page, setPage ] = useState(1);
  const selected = route.params.selected ? route.params.selected : {};
  const [ paymentType, setPaymentType ] = useState('');
  const [ selectedLanguage, setSelectedLanguage ] = useState('NGN');
  const [ selecteItems, setSelectedItems ] = useState(selected);
  const [ packages, setPackages ] = useState([]);
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ modalVisible, setModalVisible] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});
  const [ vendors, setVendors ] = useState([]);
  const [ converting, setConverting ] = useState(false);
 
  useEffect(() => { 
    setPage(1)
    setLoading(true); 
    getUserDetails();
    getPackages();
    getVendors();
    // if(selecteItems.amount !== '' && selecteItems.currencyFrom !== '' ){
    //   getExAmountFrom(selecteItems.currencyFrom);
    // }
  }, []); 

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

  const getPackages = async ()=> {   
    setLoading(true);
    fetch(`${live_url}getPackages`,{
            method: 'GET', 
          })
      .then(response => response.json())
      .then((json) => { 
        if(json.length > 0){ 
          setPackages(json);
          // setSelectedCurrencyFrom(json[0]);
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  const getVendors = async () => {   
    setLoading(true);
    fetch(`${live_url}getVendors`,{
            method: 'GET', 
          })
      .then(response => response.json())
      .then((json) => { 
        // console.log(json);
        if(json.length > 0){ 
          setVendors(json); 
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  } 
  
  const handleOnRedirect = async (response) => {  
    // console.log(response)
    if(response.status !== "successful" || !(response.tx_ref)){
        setMessage('Transaction canceled');
        setVisible(true); 
        return false;
    } 
    setLoading(true);
    var new_data = { 
      sessionId: userDetails.sessionId, 
      currencyFrom: selecteItems.currencyFrom,
      currencyTo: selecteItems.currencyTo,
      userEmail: userDetails.email,  
      vendorEmail: selecteItems.vendorEmail,
      transactionId: response.tx_ref,   
      exchangedAmount: selecteItems.exchangedAmount,
      amount: selecteItems.amount,
    } 
    fetch(`${live_url}verifyTransaction`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_data)
          }) 
      .then(response => response.json())
      .then(async(json) => { 
        if(json.responseCode == "20"){ 
            navigation.navigate('Response', { details: json })
        }else{
          setMessage(json.responseMessage);  
          setVisible(true); 
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }
 
  const convert = async () => { 
    if(selecteItems.amount == '' || !(selecteItems.currencyFrom) || !(selecteItems.currencyTo) ){
      setMessage('Amount and currency is required');
      setVisible(true); 
      return false;
    }
    var amount_data = { 
        sessionId: userDetails.sessionId,
        amount: selecteItems.amount,
        currencyFrom: selecteItems.currencyFrom,
        currencyTo: selecteItems.currencyTo,
        userEmail: userDetails.email,  
        vendorEmail: '',
    }  
    setConverting(true);
    fetch(`${live_url}submitTransaction`,{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(amount_data)
        })
    .then(response => response.json())
    .then((json) => { 
      if(json.responseCode == "00"){ 
        setSelectedItems({ 
                          ...selecteItems,   
                          exchangedAmount: json.exchangedAmount, 
                          charges: json.charges, 
                          rate: json.rate 
                        });           
      }else{
        setMessage(json.responseMessage);  
        setVisible(true); 
      }
    })
    .catch(error => console.error(error))
    .finally(res => setConverting(false))
  } 

  const moveToStep  = async (step) => {
    if( step == 1){
      setPage(step) 
    }else if( step == 2 ){
        if(selecteItems.amount == '' || !(selecteItems.currencyFrom) || !(selecteItems.currencyTo) ){
          return false;
        }
        setPage(step) 
    }else{
      if(selecteItems.vendorEmail == ''){
        return false;
      }
      setPage(step) 
    }
  }

  const moveToNextStep = (page) => {  
    if(page == 2){ 
        if(selecteItems.vendorEmail !== '' ){
            setPage(3);
        }else{
            setPage(2);
        }
    } 
  }

  const selectVedor = (item) => {
    setSelectedItems({ ...selecteItems, vendorEmail: item.vendorEmail });
    setPage(3);
  } 
 
  if(loading == true){
    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#000" size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
       <StatusBar style="light" />
       <View style={styles.header}>
            <View style={styles.nav}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable onPress={() => moveToStep(1) } style={{ width: 15, height: 15, borderRadius: 15, backgroundColor: page == 1 ? 'transparent' : '#fff', borderColor: '#fff', borderWidth: 1.5 }}></Pressable>
                    <View style={{ width: '25%', height: 5, backgroundColor: '#fff' }}></View>
                    <Pressable onPress={() => moveToStep(2) } style={{ width: 15, height: 15, borderRadius: 15, backgroundColor: page == 2 ? 'transparent' : '#fff', borderColor: '#fff', borderWidth: 1.5 }}></Pressable>
                    <View style={{ width: '25%', height: 5, backgroundColor: '#fff' }}></View>
                    <Pressable onPress={() => moveToStep(3) } style={{ width: 15, height: 15, borderRadius: 15, backgroundColor: page == 3 ? 'transparent' : '#fff', borderColor: '#fff', borderWidth: 1.5 }}></Pressable>
                    <View style={{ width: '25%', height: 5, backgroundColor: '#fff' }}></View>
                    <Pressable onPress={() => moveToStep(4) } style={{ width: 15, height: 15, borderRadius: 15, backgroundColor: page == 4 ? 'transparent' : '#fff', borderColor: '#fff', borderWidth: 1.5 }}></Pressable>
                </View> 
            </View> 
            {
                page == 1 && 
                <Text style={{ textAlign: 'center', fontFamily: 'Helvetica-Regular', color: 'rgba(255, 255, 255, 1)', fontSize: 18, marginVertical: 20  }}>Select Payment</Text>
            }
            {
                page == 2 && 
                <Text style={{ textAlign: 'center', fontFamily: 'Helvetica-Regular', color: 'rgba(255, 255, 255, 1)', fontSize: 18, marginVertical: 20  }}>Choose Vendor</Text>
            }
            {
                page == 3 && 
                <Text style={{ textAlign: 'center', fontFamily: 'Helvetica-Regular', color: 'rgba(255, 255, 255, 1)', fontSize: 18, marginVertical: 20  }}>Payment Method</Text>
            }
            {
                page == 4 && 
                <Text style={{ textAlign: 'center', fontFamily: 'Helvetica-Regular', color: 'rgba(255, 255, 255, 1)', fontSize: 18, marginVertical: 20  }}>Payment Method</Text>
            }
       </View>
       <View style={styles.body}>
            {
                page == 1 && 
                <View style={styles.topCard}> 
                    <View style={styles.formGroup}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  width: '100%', borderColor: 'grey' }}>                              
                          <Picker
                                style={{ width: '100%', height: 500, zIndex: 10, color: '#000', fontSize: 12, fontFamily: 'Helvetica-Regular' }} 
                                mode="dialog"  
                                selectedValue={selecteItems.currencyFrom}
                                onValueChange={(itemValue) => {  
                                  setSelectedItems({ 
                                          ...selecteItems,  
                                          currencyTo: itemValue.toCurrency, 
                                          currencyFrom: itemValue.fromCurrency, 
                                          exchangedAmount: 0, 
                                          charges: 0, 
                                          rate: 0
                                        }); 
                                } 
                              }
                              > 
                              {
                                  packages.length > 0 &&
                                  packages.map((item, index) => (
                                      <Picker.Item key={index} label={ item.description } value={ item } />
                                  ))
                              } 
                          </Picker> 
                      </View> 
                    </View>                             
                    <View style={{ width: '80%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={[styles.formGroup, { width: '70%' }]}>
                          <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: '100%', borderLeftWidth: .6, borderColor: 'grey', paddingLeft: 20 }}>
                              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: 'rgba(0, 0, 0, .6)', top: 5 }}>You Pay</Text>
                              <TextInput
                                  placeholder="00"
                                  placeholderTextColor="rgba(45, 187, 84, .4)"
                                  keyboardType="number-pad"
                                  value={selecteItems.amount}
                                  onChangeText={val =>{ 
                                      setSelectedItems({ 
                                            ...selecteItems,  
                                            amount: val,   
                                          }); 
                                  }}
                                  style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(45, 187, 84, 1)', width: '100%' }}
                              /> 
                          </View>
                      </View> 
                      <TouchableOpacity onPress={() => convert() } style={[styles.button, { width: '25%', height: 45, borderRadius: 5, alignSelf: 'flex-end', justifyContent: 'center' }]}>
                          <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: 'rgba(255, 255, 255, 1)' }}>convert</Text> 
                      </TouchableOpacity>
                    </View> 
                    <View style={{ width: '80%', marginVertical: 5 }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Regular', color: '#000' }}>Please click convert after typing amount to exchange</Text>
                    </View>
                    <View style={{ flexDirection: 'row', height: 100, width: '80%', marginVertical: 30  }}>
                        <View style={{ height: '100%', width: '10%', alignItems: 'center', justifyContent: 'center' }}>
                            <View  style={ selecteItems.charges ? styles.confirmAcoumt : styles.unConfirmedAmount }></View>
                            <View style={{ width: 8, height: 30, borderWidth: 3.5, borderColor: 'grey', backgroundColor: 'grey', bottom: 1 }}></View>
                            <View  style={ selecteItems.exchangedAmount ? styles.confirmAcoumt : styles.unConfirmedAmount }></View>
                            <View style={{ width: 8, height: 30, borderWidth: 3.5, borderColor: 'grey', backgroundColor: 'grey', bottom: 1  }}></View>
                            <View  style={ selecteItems.rate ? styles.confirmAcoumt : styles.unConfirmedAmount }></View>
                        </View>
                        <View style={{ height: '100%', width: '90%', justifyContent: 'space-between' }}> 
                            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: 'rgba(89, 92, 91, 1)' }}>{ selecteItems.charges > 0 ? selecteItems.charges : 0 } {selecteItems.currencyFrom} —— Lowest Transaction Fee</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: 'rgba(89, 92, 91, 1)' }}>{ selecteItems.amount - selecteItems.charges > 0 ? selecteItems.amount - selecteItems.charges : 0 } {selecteItems.currencyFrom} — Amount we’ll Convert</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: 'rgba(89, 92, 91, 1)' }}>{ selecteItems.rate > 0 ? selecteItems.rate : 0 }—- Guaranteed Rate</Text>
                        </View>
                    </View> 
                    <View style={[styles.formGroup, {  }]}> 
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: '100%', borderLeftWidth: .6, borderColor: 'grey', paddingLeft: 20 }}>
                            {
                              converting ?
                                <ActivityIndicator color="#000" />
                              :
                                <>
                                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: 'rgba(0, 0, 0, .6)', top: 5 }}>You Get</Text> 
                                  <TextInput
                                      placeholder="00"
                                      placeholderTextColor="rgba(45, 187, 84, .4)" 
                                      value={ selecteItems.exchangedAmount > 0 ?   selecteItems.exchangedAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")+' '+selecteItems.currencyTo: '0' }
                                      editable={false}
                                      style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(45, 187, 84, 1)', width: '100%'  }}
                                  /> 
                                </>
                            }  
                        </View>
                    </View>  
                    {
                      (  selecteItems.exchangedAmount > 0 && selecteItems.amount !== '' && selecteItems.currencyFrom && selecteItems.currencyTo ) &&
                      <Pressable disabled={ !selecteItems.charges || !selecteItems.exchangedAmount } onPress={() => moveToNextStep(2) } style={styles.button}>
                          <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(255, 255, 255, 1)' }}>Continue</Text>
                          <Ionicons name="ios-arrow-forward" size={18} color="#fff" />
                      </Pressable> 
                    } 
                </View>
            }
            {
              page == 2 && 
              <View style={styles.cardVendor}>
                {
                  vendors.map((item, index) => { 
                      return(
                          <View style={styles.listCon} key={index}> 
                              <View style={styles.left}>
                                  <Image source={ item.base64Pic ?  { uri: 'data:image/jpg;base64,'+item.base64Pic } : require('../assets/avartar.png') } style={{ width: 40, height: 40, borderRadius: 40, }} />
                              </View>
                              <View style={styles.middle}>
                                  <Text style={styles.middle3}>Active</Text>
                                  <Text style={styles.middle1}>{ item.businessName }</Text>
                                  <Text style={styles.middle2}>{ item.location }</Text>
                                  <Text style={styles.middle3}>USD, EUR</Text>
                              </View>
                              <View style={styles.right}> 
                                  <Pressable style={styles.rightButton} onPress={() => selectVedor(item)}>
                                      <Ionicons name="ios-arrow-forward" size={20} color="#fff" />
                                  </Pressable>
                              </View>
                          </View> 
                      )
                  })
                }
                {/* <Pressable style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreButtonText}>Load More</Text>
                </Pressable> */}
              </View>
            }
            {
                page == 3 && 
                <View style={[styles.cardVendor, { padding: 20 }]}>
                    <View style={styles.select}>                        
                        <Pressable  onPress={() => setPaymentType('card') } style={{ flexDirection: 'row' }} >
                          <View style={paymentType == 'card' ? [ styles.selectBox, { backgroundColor: 'rgba(45, 187, 84, 1)' } ] : styles.selectBox }></View>
                          <Text style={styles.selectText}>Pay with Debit Card</Text>
                        </Pressable>
                    </View>
                    <View style={styles.select}>
                      <Pressable onPress={() => setPaymentType('ussd') } style={{ flexDirection: 'row' }} >
                        <View style={paymentType == 'ussd' ? [ styles.selectBox, { backgroundColor: 'rgba(45, 187, 84, 1)' } ] : styles.selectBox }></View>
                        <Text style={styles.selectText}>USSD</Text>
                      </Pressable>
                    </View>
                    {/* <View style={styles.select}>
                        <Pressable style={styles.selectBox}></Pressable>
                        <Text style={styles.selectText}>Direct Transfer</Text>
                    </View> */}
                </View>
            } 
            {
                 ( page == 3 && paymentType == 'card' ) &&
                 <>
                    {/* <View style={styles.creditCard}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 18, fontFamily: 'Helvetica' }}>XXXX</Text>
                            <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 18, fontFamily: 'Helvetica' }}>XXXX</Text>
                            <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 18, fontFamily: 'Helvetica' }}>XXXX</Text>
                            <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 18, fontFamily: 'Helvetica' }}>XXXX</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ color: 'rgba(214, 214, 214, 1)', fontSize: 12, fontFamily: 'Helvetica' }}>MONTH/YEAR</Text>
                                <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 15, fontFamily: 'Helvetica' }}>12/22</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'rgba(214, 214, 214, 1)', fontSize: 12, fontFamily: 'Helvetica' }}>CVC2/CVV2</Text>
                                <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 15, fontFamily: 'Helvetica' }}>XXX</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View> 
                                <Text style={{ color: 'rgba(214, 214, 214, 1))', fontSize: 12, fontFamily: 'Helvetica' }}>CARD OWNER</Text>
                                <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 15, fontFamily: 'Helvetica-Regular' }}>John Doe</Text>
                            </View>
                            <View> 
                                <Text style={{ color: 'rgba(48, 48, 48, 1)', fontSize: 15, fontFamily: 'Helvetica' }}>XXX</Text>
                                <Image source={{ uri: '' }} />
                            </View>
                        </View>
                    </View> */}

                    <PayWithFlutterwave 
                        onRedirect={handleOnRedirect}
                        options={{ 
                            tx_ref: 'ZOTY'+ Math.random().toString(36).substring(7),
                            authorization: 'FLWPUBK_TEST-fc41e8185a50786f37cfa775cc773e16-X',
                            amount: Number(selecteItems.amount),
                            currency: 'NGN',
                            customer: {
                                email: userDetails.email
                            },
                            payment_options: 'card'
                        }}
                        customButton={(props) => (
                            <TouchableOpacity
                                style={[styles.button, { width: '80%', alignSelf: 'center' }]}
                                onPress={props.onPress}
                                isBusy={props.isInitializing}
                                disabled={props.disabled}>
                                <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(255, 255, 255, 1)' }}>Continue</Text>
                                <Ionicons name="ios-arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity> 
                        )}
                    />
                </>
            } 
            {
                ( page == 3 && paymentType == 'ussd' ) &&
                <View style={{ width: '80%', alignSelf: 'center' }}>
                    {/* <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 12, fontFamily: 'Helvetica-Bold', right: 10 }}> Click the copy icon to copy and paste the numbers To complete the payment </Text>

                    <View style={styles.dialList}>
                        <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(45, 187, 84, 1)', right: 15, }}></View>
                        <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 12, fontFamily: 'Helvetica-Bold', right: 10 }}>*901*50,000*1235623424#</Text>
                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Ionicons name="call"  color="rgba(45, 187, 84, 1)" size={18} style={{ marginRight: 10 }} />
                            <Ionicons name="ios-copy-outline"  color="rgba(45, 187, 84, 1)" size={18} />
                        </View>
                    </View>
                    <View style={styles.dialList}>
                        <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(45, 187, 84, 1)', right: 15, }}></View>
                        <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 12, fontFamily: 'Helvetica-Bold', right: 10 }}>*901*50,000*1235623424#</Text>
                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Ionicons name="call"  color="rgba(45, 187, 84, 1)" size={18} style={{ marginRight: 10 }} />
                            <Ionicons name="ios-copy-outline"  color="rgba(45, 187, 84, 1)" size={18} />
                        </View>
                    </View>
                    <View style={styles.dialList}>
                        <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(45, 187, 84, 1)', right: 15, }}></View>
                        <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 12, fontFamily: 'Helvetica-Bold', right: 10 }}>*901*50,000*1235623424#</Text>
                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Ionicons name="call"  color="rgba(45, 187, 84, 1)" size={18} style={{ marginRight: 10 }} />
                            <Ionicons name="ios-copy-outline"  color="rgba(45, 187, 84, 1)" size={18} />
                        </View>
                    </View>
                    <View style={styles.dialList}>
                        <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(45, 187, 84, 1)', right: 15, }}></View>
                        <Text style={{ color: 'rgba(0, 0, 0, 1)', fontSize: 12, fontFamily: 'Helvetica-Bold', right: 10 }}>*901*50,000*1235623424#</Text>
                        <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Ionicons name="call"  color="rgba(45, 187, 84, 1)" size={18} style={{ marginRight: 10 }} />
                            <Ionicons name="ios-copy-outline"  color="rgba(45, 187, 84, 1)" size={18} />
                        </View>
                    </View> */}
                    <PayWithFlutterwave 
                        onRedirect={handleOnRedirect}
                        options={{ 
                            tx_ref: 'ZOTY'+ Math.random().toString(36).substring(7),
                            authorization: 'FLWPUBK_TEST-fc41e8185a50786f37cfa775cc773e16-X',
                            amount: Number(selecteItems.amount),
                            currency: 'NGN',
                            customer: {
                                email: userDetails.email
                            },
                            payment_options: 'ussd'
                        }}
                        customButton={(props) => (
                            <TouchableOpacity
                                style={[styles.button, { width: '100%', alignSelf: 'center' }]}
                                onPress={props.onPress}
                                isBusy={props.isInitializing}
                                disabled={props.disabled}>
                                <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(255, 255, 255, 1)' }}>Continue</Text>
                                <Ionicons name="ios-arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity> 
                        )}
                    />
                </View>
            }
          <Pressable onPress={() => page <= 1 ? navigation.goBack() : setPage(page - 1) } style={{ width: '100%', alignItems: 'flex-start', left: 30, bottom: 30 }}>
            <Text style={{ color: 'rgba(45, 187, 84, 1)', fontSize: 20, fontFamily: 'Helvetica-Bold' }}><Ionicons name="arrow-back" color="rgba(45, 187, 84, 1)" size={18} /> Back</Text>   
          </Pressable>
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
  }, 
  header:{
    flex: .8,
    width,
    padding: 30,
    backgroundColor: 'rgba(45, 187, 84, 1)',
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  body:{
    flex: 3.2,
    width,
    justifyContent: 'space-between',
  }, 
  confirmAcoumt:{ 
    width: 15, 
    height: 15, 
    borderRadius: 20, 
    borderWidth: 3.5, 
    borderColor: 'grey', 
    backgroundColor: '#fff', 
    bottom: 2
  },
  unConfirmedAmount:{ 
    width: 15, 
    height: 15, 
    borderRadius: 20, 
    borderWidth: 3.5, 
    borderColor: 'grey', 
    backgroundColor: 'grey', 
    bottom: 2, 
  },
  topCard:{
    width: '100%', 
    borderRadius: 10,  
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '8%',
  },
  formGroup:{
    width: '80%',
    height: 45,
    borderRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button:{
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(45, 187, 84, 1)',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  cardVendor:{
    width: '80%', 
    borderRadius: 5,  
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '8%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    maxHeight: 500, 
    padding: 5,
  },
  listCon:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: .2,
    borderColor: 'grey',
    marginVertical: 5,
    padding: 10,
  },
  left:{ 
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  middle:{
    justifyContent: 'center',
    width: '60%',
  },
  middle1:{
    fontSize: 15,
    color: 'rgba(48, 48, 48, 1)',
    fontFamily: 'Helvetica-Bold',
  },
  middle2:{
    fontSize: 13,
    color: 'rgba(89, 92, 91, 1)',
    fontFamily: 'Helvetica',
  },
  middle3:{
    fontSize: 11,
    color: 'grey',
    fontFamily: 'Helvetica-Regular',
  },
  right:{
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  rightButton:{
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 187, 84, 1)',
  },
  loadMoreButton:{
    width: 80,
    height: 30,
    borderWidth: 1,
    borderColor: 'rgba(45, 187, 84, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 5,
  },
  loadMoreButtonText:{
    color: 'rgba(100, 98, 98, 1)',
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  select:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  selectBox:{
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(219, 216, 216, 1)'
  },
  selectText:{
    color: 'rgba(48, 48, 48, 1)',
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    left: 10,
  },
  creditCard:{
    width: '80%',
    height: 200, 
    borderRadius: 5,
    elevation: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 20,
    justifyContent: 'space-evenly',
  },
  dialList:{
    width: '100%',
    height: 40,
    borderWidth: .6,
    borderColor: 'rgba(151, 151, 151, 1)',
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }


});