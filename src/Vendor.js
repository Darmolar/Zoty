import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, Image, Switch, Modal, ActivityIndicator } from 'react-native'
import { Ionicons, AntDesign, Feather, MaterialCommunityIcons, MaterialIcons, Entypo, Foundation } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function VendorScreen({navigation}) {
  const [ vendorVisible, setVendorVisible ] = useState(false);   
  const [ vendors, setVendors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({}); 
  const [ selectedVendor, setSelectedVendor ] = useState({}); 
  const [ messageVendor, setMessageVendor ] = useState('');
  const [ allVendorComment, setAllVendorComment ] = useState([]);
  const [ sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {      
        setLoading(true); 
        getUserDetails();
        getVendors();
    }); 
    return unsubscribe;
  }, [navigation])

  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user));
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 
  
  const getVendors = async () => {   
    setLoading(true);
    fetch(`${live_url}getVendors`,{
            method: 'GET', 
          })
      .then(response => response.json())
      .then((json) => {  
        if(json.length > 0){ 
          setVendors(json); 
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
  }

  const sendComment = async (email) => {
    setSendingMessage(true);
    var data = {
      message: messageVendor,
      userEmail: userDetails.email,
      vendorEmail: email,
      sessionId:  userDetails.sessionId,
    } 
    fetch(`${live_url}messageVendor `,{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
    .then(response => response.json())
    .then((json) => {  
      if(json.responseCode == "00"){ 
        getVendorMessages(email);
        setMessageVendor('');
      } 
    })
    .catch(error => console.error(error))
    .finally(res => setSendingMessage(false))  
  }
 
  const getVendorMessages  = async (email) => {
    setSendingMessage(true);
    var data = { 
      vendorEmail: email, 
    } 
    fetch(`${live_url}getVendorMessages  `,{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
    .then(response => response.json())
    .then((json) => {  
      if(json.length > 0){ 
        setAllVendorComment(json); 
      }  
    })
    .catch(error => console.error(error))
    .finally(res => setSendingMessage(false) )  
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
       <StatusBar style="light" />
       <View style={styles.header}>
          <View style={styles.nav}>  
              <AntDesign name="left" size={20} color="#fff" style={{ left: 20, }} onPress={() => navigation.goBack() } />
              <View style={{ alignItems: 'center' }}>
                <Feather name="users" size={25} color="#fff" />
                <Text style={styles.navText}>Our Vendors</Text>
              </View>
              <View></View>
          </View>  
       </View>
       <View style={styles.body}> 
          <View style={styles.bodyCard}>
            <ScrollView style={{ width: '100%', padding: 10 }}>
              {
                vendors.length > 0 &&
                vendors.map((item, index) => { 
                  return (
                    <Pressable style={styles.listCon} key={index}  onPress={() => { setSelectedVendor(item); getVendorMessages(item.emailAddress); setVendorVisible(true);  } }> 
                        <View style={styles.left}>
                            <View style={{ width: 10, height: 10, borderRadius: 5, top: '15%', left: '15%', zIndex: 1, backgroundColor: item.activeInd == 0 ? 'grey' : 'rgba(45, 187, 84, 1)', alignSelf: 'flex-start' }}></View>
                            <Image source={  item.base64Pic ?  { uri: 'data:image/jpg;base64,'+item.base64Pic } : require('../assets/avartar.png')} style={{ width: 40, height: 40, borderRadius: 40, }} />
                        </View>
                        <View style={styles.middle}>
                            <Text style={styles.middle3}>{ item.activeInd == 0 ? 'In Active' : 'Active' }</Text>
                            <Text style={styles.middle1}>{ item.businessName }</Text>
                            <Text style={styles.middle2}>{ item.location }</Text>
                            <Text style={styles.middle3}>USD, NGN</Text>
                        </View>
                        <View style={styles.right}>
                            <View style={styles.rightButton}> 
                                <Entypo name="dots-two-horizontal" size={20} color="#fff" style={{ top: 5.5 }} />
                                <Entypo name="dots-two-horizontal" size={20} color="#fff" style={{ bottom: 5.5 }} />
                            </View>
                        </View>
                    </Pressable>
                  )
                })
              }
            </ScrollView>
          </View> 
       </View>

       <Modal
            animationType="slide"
            transparent={true} 
            visible={vendorVisible}
          >
          <View style={styles.centeredView} >
            <Ionicons name="close" size={30} color="#fff" style={{ alignSelf: 'flex-end', paddingRight: 20, marginBottom: 20 }} onPress={() => setVendorVisible(false) } />
            <View style={styles.modalView}> 
              <View style={{  alignItems: 'center', marginTop: -50 }}>
                <Image source={ selectedVendor.base64Pic ?  { uri: 'data:image/jpg;base64,'+selectedVendor.base64Pic } : require('../assets/avartar.png')} style={{ width: 70, height: 70, borderRadius: 70, borderWidth: 2, borderColor: '#fff' }} />
                <Text style={styles.modalTitle}>{ selectedVendor.businessName }</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                  <Text style={styles.modalText}>{ selectedVendor.location }</Text>
                  <Text style={styles.modalTextTag}>|</Text>
                  <Text style={styles.modalText}>USD,EUR,YEN</Text>
                  <Text style={styles.modalTextTag}>|</Text>
                  <Text style={styles.modalText}>{ selectedVendor.minimumExchangeAmount } above</Text>                
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10, }}>
                  <Pressable onPress={() => navigation.navigate('Payment', { selected: {
                                                                                amount: '',
                                                                                currencyFrom: '',
                                                                                currencyTo: '',
                                                                                userEmail: '',
                                                                                vendorEmail:  selectedVendor.emailAddress,
                                                                                sessionId: '',
                                                                              } 
                                                                          }
                                                                        )} 
                        style={[styles.selectButton, { backgroundColor: 'rgba(113, 177, 179, 1)', right: 10 }]}>
                    <Text style={[styles.selectButtonText, { color: 'rgba(255, 255, 255, 1)' }]}>Choose Vendor</Text>
                  </Pressable> 
                </View>
              </View>
              <View style={styles.addressBox}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                    <Foundation name="home" size={15} color="rgba(122, 143, 166, 1)" />
                    <Text style={styles.addressBoxText}>{ selectedVendor.location }</Text>
                  </View>
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                    <AntDesign name="clockcircle" size={15} color="rgba(122, 143, 166, 1)" />
                    <Text style={styles.addressBoxText}>{ selectedVendor.location }</Text>
                  </View> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                    <Foundation name="info" size={15} color="rgba(122, 143, 166, 1)" />
                    <Text style={styles.addressBoxText}>{ selectedVendor.emailAddress }</Text>
                  </View> 
              </View>
              <View style={styles.commentBox}>
                <Text style={{ fontSize: 14, color: 'rgba(59, 76, 132, .5)', fontFamily: 'Helvetica-Regular', }}>Comments About Vendor </Text>
                <ScrollView style={{ width: '100%', maxHeight: 150, }} showsVerticalScrollIndicator={false} >
                  { 
                    allVendorComment.map((item, index) => {
                      return (
                          <View style={styles.commnetList} key={index}>
                            <View style={styles.commnetListLeft}>
                                <Image source={require('../assets/avartar.png')} style={{ width: 30, height: 30, borderRadius: 30, }} />
                            </View>
                            <View style={styles.commnetListRight}>
                              <View style={styles.commnetListRightTop}>
                                  <Text style={styles.commnetListRightTopText}>{ item.userEmail }</Text>
                                  <Text style={styles.commnetListRightTopText2}> { item.dateSent }</Text>
                              </View>
                              <Text style={styles.commnetListRightText}>{ item.message }</Text>
                            </View>
                          </View>
                      )
                    })
                  } 
                </ScrollView>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                  <TextInput 
                      style={styles.commentInput}
                      placeholderTextColor="rgba(209, 209, 209, 1)"
                      placeholder="Type Message"
                      value={messageVendor}
                      onChangeText={val => setMessageVendor(val) } 
                  /> 
                  {
                    sendingMessage === true
                    ?
                      <ActivityIndicator color="#000" size="small"  style={{ padding: 10, top: 20, }} />
                    :
                      <Feather name="send" size={24} color="black" onPress={() => sendComment(selectedVendor.emailAddress) } style={{ padding: 10, top: 20, }} />
                  } 
                </View>
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
    backgroundColor: 'rgba(113, 177, 179, 1)',
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
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
  },
  body:{
    flex: 3.4,
    width,
  },    
  bodyCard:{
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    marginTop: -40,
    alignSelf: 'center',
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
    color: '#000',
    fontFamily: 'Helvetica',
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
      backgroundColor: 'rgba(113, 177, 179, 1)',
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: { 
    width: '100%',
    padding: 20,
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
  modalTitle:{
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: 'rgba(45, 63, 123, 1)',
  },
  modalText:{
    fontSize: 14,
    fontFamily: 'Helvetica-Regular',
    color: 'rgba(45, 63, 123, 1)',
  },
  modalTextTag:{
    fontSize: 13,
    fontFamily: 'Helvetica-Regular',
    color: 'rgba(45, 63, 123, .6)',
  },
  selectButton:{
    height: 30,
    minWidth: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'rgba(113, 177, 179, 1)'
  },
  selectButtonText:{
    fontSize: 13,
    fontFamily: 'Helvetica-Regular', 
  },
  addressBox:{
    width: '100%',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: 'rgba(122, 143, 166, 1)',
    marginVertical: 10,
  },
  addressBoxText:{
    fontSize: 13,
    fontFamily: 'Helvetica-Regular',
    color: 'rgba(122, 143, 166, 1))',
    left: 10
  },
  commentBox:{
    width: '100%',
    padding: 10,
  },
  commnetList:{
    width: '100%',
    flexDirection: 'row',

  },
  commnetListLeft:{
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  commnetListRight:{
    width: '90%',
    padding: 10
  },
  commnetListRightText:{ 
      fontSize: 13,
      fontFamily: 'Helvetica-Regular',
      color: '#000',
  },
  commnetListRightTop:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  commnetListRightTopText:{
    fontSize: 13,
    fontFamily: 'Helvetica',
    color: 'rgba(122, 143, 166, 1))', 
  }, 
  commnetListRightTopText2:{
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: 'grey', 
  },
  commnetListRightTop2:{
    fontSize: 14,
    fontFamily: 'Helvetica-Regular',
    color: '#000', 
  },
  commentInput:{
    width: '80%',
    height: 40,
    justifyContent: 'center',
    color: 'rgba(209, 209, 209, 1)',
    fontSize: 14,
    fontFamily: 'Helvetica',
    backgroundColor: 'rgba(122, 143, 166, .9)',
    borderRadius: 20,
    alignSelf: 'center',
    padding: 10,
    top: 20,
  }
});