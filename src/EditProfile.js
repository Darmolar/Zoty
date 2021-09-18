import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, Image, Platform, ActivityIndicator } from 'react-native'
import { Ionicons, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Rect } from 'react-native-svg';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { Button, Snackbar } from 'react-native-paper';
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function EditProfileScreen({navigation}) {
  const [ page, setPage ] = useState(1);
  const [ paymentType, setPaymentType ] = useState('');
  const [isEnabled, setIsEnabled] = useState(false); 
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false); 
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    setPage(1)
    getUserDetails();
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, [navigation])
  
  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };


  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user));
      // console.log(JSON.parse(user));
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    // console.log(result);
 
    if (!result.cancelled) {
      // setImage(result.uri);
      
      setLoading(true)
      fetch(`${live_url}updateProfilePic`,{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: userDetails.email, 
                sessionId: userDetails.sessionId,
                base64Pic: result.base64,
              })
            })
        .then(response => response.json())
        .then(async(json) => { 
          if(json.responseCode == "00"){  
            var value =  await SecureStore.getItemAsync('user_details') 
            var datas = JSON.parse(value);
            datas.base64Pic = result.base64; 
            var json_datas = JSON.stringify(datas);
            await SecureStore.deleteItemAsync('user_details');
            await SecureStore.setItemAsync('user_details', json_datas); 
            getUserDetails();
            setMessage(json.responseMessage); 
            setVisible(true)
          }else{
            setMessage(json.responseMessage); 
            setVisible(true)
          }
        })
        .catch(error => console.error(error))
        .finally(res => setLoading(false)) 
    }
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
              <Text style={styles.navText}>My Profile</Text>
              <Text></Text>
          </View>  
       </View>
       <View style={styles.body}> 
          <Pressable style={styles.bodyCard}  onPress={() => pickImage()}> 
            <Image source={ userDetails.base64Pic ?  { uri: 'data:image/jpg;base64,'+userDetails.base64Pic } : require('../assets/avartar.png') } style={{ width: 50, height: 50, borderRadius: 50, borderWidth: .5, borderColor: 'grey' }} />
            <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold' }}>{userDetails.firstName} {userDetails.lastName}</Text>
            <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: 'rgba(34, 33, 91, 0.6)' }}>{userDetails.userTypeInd == 1 ? 'Member' : 'Vendor'}</Text> 
          </Pressable>  
          <View style={styles.form}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[styles.formGroup, { width: '46%' }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Funsho"
                        value={userDetails.firstName}
                        editable={false}
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                    />
                </View>
                <View style={[styles.formGroup, { width: '46%' }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Funsho"
                        value={userDetails.lastName}
                        editable={false}
                        placeholderTextColor="rgba(37, 50, 116, 0.6)"
                    />
                </View>
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Funshjohnson@gmail.com"
                    placeholderTextColor="rgba(37, 50, 116, 0.6)"
                    value={userDetails.email}
                    editable={false}
                />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="081 000 000 0000"
                    placeholderTextColor="rgba(37, 50, 116, 0.6)"
                    value={userDetails.phoneNumber}
                    editable={false}
                />
            </View> 

            {/* <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Save Changes</Text>
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
    height: '20%',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    marginTop: -40,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  form:{
    width: '80%',
    alignItems: 'center', 
    alignSelf: 'center',
    marginTop: 30
  },
  formGroup:{
    width: '100%',
    height: 50,
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
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
  }
});