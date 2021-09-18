import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import { Button, Snackbar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window'); 

export default function SearchScreen({navigation}) { 
  const [ page, setPage ] = useState(1);
  const [ paymentType, setPaymentType ] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState); 
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({}); 
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);
  const [ search, setSearch] = useState([]);
  const [ cities, setCities ] = useState([
                                      {name: 'Vendor', route: 'Vendor'},
                                      {name: 'Become a Vendor', route: 'BusinessHome'},
                                      {name: 'Convert Currency', route: 'Payment'  },
                                      {name: 'Exchange Currency', route: 'Payment'},
                                      {name: 'Profile', route: 'EditProfile'}
                                  ]);

  useEffect(() => {
    setLoading(true);
    getUserDetails(); 
  }, [navigation])

  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };

  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user));
      console.log(JSON.parse(user));
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 

  const getSearch = (text) => {
    let bigCities = cities.filter(city => {
      if (city.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())) { 
        return city;
      }
    });
    setSearch(bigCities);
  }

  return (
    <View style={styles.container}>  
       <StatusBar style="dark" />
       <View style={styles.header}>
           <View style={styles.nav}> 
            <View style={styles.searchCon}>
                <Ionicons name="ios-search" color='rgba(0, 0, 0, .4)' size={17} />
                <TextInput
                    placeholder="Search for what you want"
                    placeholderTextColor="rgba(0, 0, 0, .4)"
                    style={styles.input}
                    onChangeText={(value) => getSearch(value) }
                />
            </View>
            <TouchableOpacity onPress={() => navigation.goBack() }>
                <Text style={{ fontSize: 15, color: '#2DBB54', fontFamily: 'Helvetica-Bold',}}>Cancel</Text>
            </TouchableOpacity>
          </View>
       </View>
       <View style={styles.body}> 
          {
            search.map((item, index) => (
              <Pressable onPress={() => item.route == "Payment" ? navigation.navigate( item.route, {selected: {
                                                                                                        amount: '',
                                                                                                        currencyFrom: '',
                                                                                                        currencyTo: '',
                                                                                                        userEmail: '',
                                                                                                        vendorEmail: '',
                                                                                                        sessionId: '',
              }}) : navigation.navigate(item.route) } style={styles.listCon} key={index}>
                  <View style={styles.listConButton} ></View>
                  <Text style={styles.listConText}>{item.name}</Text>
              </Pressable>
            ))
          } 
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
    flex: .4,
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
    width: '80%',
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
    flex: 3.6,
    width,  
    marginTop: 20
  },
  listCon:{
    width: '100%',
    padding: 20, 
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listConButton:{
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: .5,
    borderColor: 'grey',
  },
  listConText:{
    fontSize: 15,
    color: 'rgba(0, 0, 0, .8)',
    fontFamily: 'Helvetica-Bold',
    marginLeft: 10,
    left: '20%',
  }
});