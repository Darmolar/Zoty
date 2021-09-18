import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, TextInput, ScrollView, Image, Modal, Alert, ActivityIndicator } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({navigation}) {
  const [ selectedCurrencyFrom, setSelectedCurrencyFrom] = useState({});
  // const [ selectedCurrencyTo, setSelectedCurrencyTo] = useState({});
  const [ packages, setPackages ] = useState([]);
  const [ modalVisible, setModalVisible] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});
  const [ amount, setAmount ] = useState('');
  const changeFrom = useRef();
  const changeTo = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => { 
      setLoading(true); 
      getUserDetails(); 
      getPackages();
    }); 
    // navigation.addListener('beforeRemove', (e) => {      
    //   e.preventDefault(); 
    //   Alert.alert(
    //     'Logout ?',
    //     'Are you sure you want to logout?',
    //     [
    //       { text: "No", style: 'cancel', onPress: () => {} },
    //       {
    //         text: 'Yes',
    //         style: 'destructive', 
    //         onPress: async () => {
    //           await SecureStore.deleteItemAsync('user_details')
    //           navigation.dispatch(e.data.action);
    //         },
    //       },
    //     ]
    //   );
    // });
    return unsubscribe;
  },[navigation])

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
          setPackages(json);
          setSelectedCurrencyFrom(json[0]);
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
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
       <View style={styles.header}>
          <View style={styles.nav}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={ userDetails.base64Pic ?  { uri: 'data:image/jpg;base64,'+userDetails.base64Pic } : require('../assets/avartar.png')  } borderRadius={40} style={{ width: 40, height: 40 }} />
                <Text style={{ fontFamily: 'Helvetica', color: '#2DBB54', fontSize: 15, left: 5  }}>Hello { userDetails.firstName },</Text>
            </View>
            <Ionicons name="ios-notifications-outline" color="#2DBB54" size={30}  onPress={() => setModalVisible(true)} />
          </View>
       </View>
       <View style={styles.body}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ width: '80%' }}>
            <Pressable onPress={() => navigation.navigate('Search') } style={styles.searchCon}>
              <Ionicons name="ios-search" color='rgba(0, 0, 0, .9)' size={17} />
              <TextInput
                placeholder="Search for what you want"
                placeholderTextColor="rgba(0, 0, 0, .4)"
                style={styles.input}
                editable={false}
                onPress={() => navigation.navigate('Search') }
              />
            </Pressable>
            
            {
              userDetails.userTypeInd == 1
              ?
                <View style={styles.topCard}>
                  <View style={[styles.formGroup, { borderColor: 'rgba(45, 187, 84, 1)', zIndex: -10 }]}>                    
                    <View style={{ width: '100%', zIndex: -10 }}>
                        <Picker 
                            style={{ height: 500, zIndex: 10, color: '#000', fontSize: 12, fontFamily: 'Helvetica-Regular' }} 
                            mode="dialog"  
                            selectedValue={selectedCurrencyFrom}
                            onValueChange={(itemValue, itemIndex) =>
                              { setSelectedCurrencyFrom(itemValue); }
                          }> 
                          {
                            packages.length > 0 &&
                            packages.map((item, index) => (
                              <Picker.Item key={index} label={ item.description } value={ item } />
                            ))
                          }
                        </Picker>
                    </View>
                   {/* <View style={{ width: '50%', height: '100%', alignItems: 'flex-start',}}>
                       <Picker 
                            style={{ width: 100, height: 500, zIndex: 10, color: '#000', fontSize: 15, fontFamily: 'Helvetica-Regular' }} 
                            mode="dropdown"  
                            editable={false}
                            selectedValue={selectedCurrencyFrom.toCurrency}
                            onValueChange={(itemValue, itemIndex) =>
                              // setSelectedCurrencyTo(itemValue)
                          }>
                          {
                            packages.length > 0 &&
                            packages.map((item, index) => (
                              <Picker.Item key={index} label={ item.toCurrency } value={ item.toCurrency } />
                            ))
                          }
                        </Picker> 
                        <Text style={{ width: 100, height: 500, color: '#000', fontSize: 18, left: '20%', top: '30%', fontFamily: 'Helvetica-Regular' }} >{ selectedCurrencyFrom.toCurrency }</Text>
                    </View> */}
                  </View>
                  <Pressable style={styles.convert} onPress={() => navigation.navigate('Payment',{ selected: {
                                                                                                        amount: amount,
                                                                                                        currencyFrom: selectedCurrencyFrom.fromCurrency,
                                                                                                        currencyTo: selectedCurrencyFrom.toCurrency,
                                                                                                        userEmail: '',
                                                                                                        vendorEmail: '',
                                                                                                        sessionId: '',
                                                                                                      } 
                                                                                                  }) }>
                    <MaterialCommunityIcons name="bank-transfer" size={24} color="black" />
                  </Pressable>
                  <View style={[styles.formGroup, { borderColor: 'rgba(0, 137, 255, 1)' }]}>
                    <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center', top: '2%', paddingLeft: 15 }}>
                      <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: 'rgba(0, 0, 0, .6)' }}>You Pay</Text> 
                      <TextInput 
                          placeholder="1,000.00"
                          style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(0, 137, 255, 1)' }}
                          value={amount} 
                          onChangeText={val =>  setAmount(val)}
                        />
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center',top: '2%', paddingLeft: 15 }}>
                      <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: 'rgba(0, 0, 0, .6)' }}>You Get</Text>
                      <TextInput 
                          placeholder="1,000.00"
                          style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: 'rgba(0, 137, 255, 1)' }}
                          editable={false}
                        />
                    </View>
                  </View>
                </View>
              :
                <View style={[styles.topCard, { height: 250 }]}>
                  <Image borderRadius={10} source={require('../assets/vendor_img.jpg')} style={{  width: '100%', height: '100%'  }} resizeMode="cover" />
                </View> 
            }
            
            <TouchableOpacity style={styles.card}  onPress={() => navigation.navigate('Payment', { selected: {
                                                                                                        amount: amount,
                                                                                                        currencyFrom: selectedCurrencyFrom.fromCurrency,
                                                                                                        currencyTo: selectedCurrencyFrom.toCurrency,
                                                                                                        userEmail: '',
                                                                                                        vendorEmail: '',
                                                                                                        sessionId: '',
                                                                                                      } 
                                                                                                  }) } >
                <Image source={{ uri: 'https://cdn.pixabay.com/photo/2016/09/29/07/58/dollar-1702283_1280.png' }} borderTopLeftRadius={10} borderTopRightRadius={10} style={{ flex: 1 }} resizeMode="cover" />
                <View style={styles.cardFooter}>
                    <Text style={{ fontFamily: 'Helvetica', color: '#2DBB54', fontSize: 15 }}>Change your Currency</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="rgba(26, 96, 81, 1)" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card}  onPress={() => navigation.navigate('Vendor') }>
                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRdJP0Wuav2IERDv33MG2HInOlQwHl7C7beA&usqp=CAU' }} borderTopLeftRadius={10} borderTopRightRadius={10} style={{ flex: 1 }} resizeMode="cover" />
                <View style={styles.cardFooter}>
                    <Text style={{ fontFamily: 'Helvetica', color: '#2DBB54', fontSize: 15 }}>Check our Vendors</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="rgba(26, 96, 81, 1)" />
                </View>
            </TouchableOpacity>
            {
              userDetails.userTypeInd == 1 &&
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BusinessHome') }>
                  <Image source={{ uri: 'https://www.coinworld.com/images/default-source/news/100-dollars-2013-overseas.jpg?sfvrsn=2f6bfb33_0' }} borderTopLeftRadius={10} borderTopRightRadius={10} style={{ flex: 1 }} resizeMode="cover" />
                  <View style={styles.cardFooter} >
                      <Text style={{ fontFamily: 'Helvetica', color: 'rgba(0, 137, 255, 1)', fontSize: 13 }}>Become a Vendor</Text>
                      <Ionicons name="ios-arrow-forward" size={18} color="rgba(0, 137, 255, 1)" />
                  </View>
              </TouchableOpacity>
            }

          </ScrollView>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible} 
            >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Ionicons name="close-outline" size={24} color="black" onPress={() => setModalVisible(false)}  style={{ alignSelf: 'flex-end', right: 20 }}  />

                <View style={{ width: '100%', marginVertical: 30, justifyContent: 'center' }}>
                  <Text style={styles.listConTextConH1}>No new notification</Text>
                </View>
                 {/* <TouchableOpacity ></TouchableOpacity> */}
                  <ScrollView style={{ width }}>
                      {/* <View style={styles.listCon}>
                          <View style={styles.listConFirst}>
                            <View style={styles.listConTextCon}>
                              <Text style={styles.listConTextConH1}>New Deal Awaits You</Text>
                              <Text style={styles.listConTextConH6}>Rhoncus ipsum eget tempus. Praesent</Text>
                            </View> 
                            <Pressable style={styles.listConTextConButton}>
                              <Ionicons name="trash-outline" size={24} color="rgba(45, 187, 84, 1)" />
                            </Pressable>
                          </View>
                          <Text style={styles.listConDetails}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                            the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the 
                            release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
                            like Aldus PageMaker including versions of Lorem Ipsum.</Text>
                      </View>  */}
                      {/* <View style={styles.listCon}>
                          <View style={styles.listConFirst}>
                            <View style={styles.listConTextCon}>
                              <Text style={styles.listConTextConH1}>New Deal Awaits You</Text>
                              <Text style={styles.listConTextConH6}>Rhoncus ipsum eget tempus. Praesent</Text>
                            </View> 
                            <Pressable style={styles.listConTextConButton}>
                              <Ionicons name="trash-outline" size={24} color="rgba(45, 187, 84, 1)" />
                            </Pressable>
                          </View>
                      </View> 
                      <View style={styles.listCon}>
                          <View style={styles.listConFirst}>
                            <View style={styles.listConTextCon}>
                              <Text style={styles.listConTextConH1}>New Deal Awaits You</Text>
                              <Text style={styles.listConTextConH6}>Rhoncus ipsum eget tempus. Praesent</Text>
                            </View> 
                            <Pressable style={styles.listConTextConButton}>
                              <Ionicons name="trash-outline" size={24} color="rgba(45, 187, 84, 1)" />
                            </Pressable>
                          </View>
                      </View> 
                      <View style={styles.listCon}>
                          <View style={styles.listConFirst}>
                            <View style={styles.listConTextCon}>
                              <Text style={styles.listConTextConH1}>New Deal Awaits You</Text>
                              <Text style={styles.listConTextConH6}>Rhoncus ipsum eget tempus. Praesent</Text>
                            </View> 
                            <Pressable style={styles.listConTextConButton}>
                              <Ionicons name="trash-outline" size={24} color="rgba(45, 187, 84, 1)" />
                            </Pressable>
                          </View>
                      </View>   */}

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
  header:{
    flex: .2,
    width,
    padding: 30,
  },
  nav:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  searchCon:{
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .5)',
    marginVertical: 20,
    padding: 10,
  },  
  input:{
    fontSize: 15,
    color: 'rgba(0, 0, 0, .4)',
    fontFamily: 'Helvetica-Regular',
    marginLeft: 10,
  },
  body:{ 
    flex: 3.8,
    width,
    alignItems: 'center', 
  },
  topCard:{
    width: '100%',
    height: 150,
    borderRadius: 10, 
    elevation: 2,
    backgroundColor: '#fff',
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup:{
    width: '80%',
    height: 45,
    borderWidth: 1, 
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  convert:{
    width: 35,
    height: 35,
    borderRadius: 35,
    borderWidth: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -10,
    borderColor: 'rgba(45, 187, 84, 1)',
    backgroundColor: '#fff',
    zIndex: 11
  },
  card:{
    width: '100%',
    height: 120,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10, 
    elevation: 2,
    backgroundColor: '#fff',
    marginVertical: 7,
  },
  cardFooter:{
    width: '100%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width, 
    maxHeight: 550,
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
  listCon:{
    width: '90%',
    alignSelf: 'center',
    minHeight: 50,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
  },
  listConFirst:{
    flexDirection: 'row',
  },
  listConTextCon:{
    width: '85%', 
  },
  listConTextConButton:{ 
    width: '15%',
    height: 40,
    backgroundColor: 'rgba(45, 187, 84, .2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  listConTextConH1:{
    fontSize: 15,
    color: 'rgba(0, 0, 0, .8)',
    fontFamily: 'Helvetica-Bold',
  },
  listConTextConH6:{
    fontSize: 13,
    color: 'rgba(0, 0, 0, .6)',
    fontFamily: 'Helvetica',
  },
  listConDetails:{ 
    fontSize: 12,
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'justify',
    marginVertical: 10,
  }
});