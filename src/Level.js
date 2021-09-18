import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, Image, Switch, ActivityIndicator } from 'react-native'
import { Ionicons, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Button, Snackbar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function LevelScreen({navigation}) {
  const [ page, setPage ] = useState(1);
  const [ paymentType, setPaymentType ] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState); 
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({}); 
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false);

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
  return (
    <View style={styles.container}>
       <StatusBar style="light" />
       <View style={styles.header}>
          <View style={styles.nav}>  
              {/* <AntDesign name="left" size={20} color="#fff" style={{ left: 20, }} />
              <Text style={styles.navText}>Settings</Text>
              <Text></Text> */}
          </View>  
       </View>
       <View style={styles.body}> 
          <View style={styles.bodyCard}>
              <View style={styles.bodyCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="left" size={18} color="#000" style={{ left: 10, }} onPress={() => navigation.goBack() } />
                    <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', left: 30 }}>Levels</Text>
                </View>
              </View>
              <View style={styles.bodyCardBody}>
                  <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', left: 10, color: '#ADADAD' }}>Settings</Text>
                  <View style={styles.buttonNav} >
                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: 'rgba(89, 92, 91, 1)' }}></View>
                    <View style={{  width: '90%' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#000000', }}>Email Verification</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'Helvetica', color: '#000', }}>Your Email address has been verified successfully.</Text> 
                    </View>
                  </View> 
                  <View style={styles.buttonNav} >
                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: userDetails.bvnVerified ? 'rgba(89, 92, 91, 1)' : 'rgba(219, 216, 216, 1)' }}></View>
                    <View style={{  width: '90%' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#000000', }}>BVN Verification</Text>
                        {/* <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Regular', color: '#000000', }}>Your Email address has been verified successfully.</Text>  */}
                    </View>
                  </View> 
                  {/* <View style={styles.buttonNav} >
                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: 'rgba(219, 216, 216, 1)' }}></View>
                    <View style={{  width: '90%' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#000000', }}>ID Verification</Text>
                        {/* <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Regular', color: '#000000', }}>Your Email address has been verified successfully.</Text>  
                    </View>
                  </View>                     */}
                  {/* <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Complete Verification Process</Text>
                  </Pressable> */}
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
       </View>
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
    //  height: '9%',
     padding: 20,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: 10, 
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
  }
});