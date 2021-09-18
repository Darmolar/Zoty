import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { Button, Snackbar } from 'react-native-paper'; 
import { live_url } from './Network';

const { width, height } = Dimensions.get('window');

export default function HistoryScreen({navigation}) {
  const [ type, setType ] = useState('All');  
  const [ message, setMessage ] = useState('');
  const [ visible, setVisible] = useState(false); 
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({}); 
  const [ transactionHistory, setTransactionHistory ] = useState([]);
   
  useEffect(() => { 
    setLoading(true); 
    getUserDetails();  
  }, []); 

  const onDismissSnackBar = () => {  setVisible(false); setMessage('') };
  
  const getUserDetails = async () => {
    const user = await SecureStore.getItemAsync('user_details');
    if(user !== null){
      setUserDetails(JSON.parse(user));
      getTransactionHistory(JSON.parse(user));
    }else{
      navigation.navigate('Login');
    }
    setLoading(false);
  } 
  
  const getTransactionHistory = async (user)=> {   
    setLoading(true);
    console.log({
              userEmail: user.email,
              sessionId: user.sessionId
            })
    fetch(`${live_url}getTransactionList`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userEmail: user.email,
              sessionId: user.sessionId
            })
          })
      .then(response => response.json())
      .then((json) => {
        console.log(json); 
        // if(json.length > 0){ 
        //   setPackages(json);
        //   setSelectedCurrencyFrom(json[0]);
        // } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))  
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
        <StatusBar style="dark" />
        <View style={styles.body}>
          <Text style={styles.bodyH1}>History</Text>

          <View style={styles.bodyTop}>
            <Pressable onPress={() => setType('All')} style={ type == 'All' ? [styles.optionTab, { backgroundColor: '#fff', }] :  [styles.optionTab] }>
              <Text style={styles.optionTabText}>All</Text>
            </Pressable>
            <Pressable onPress={() => setType('Successful')} style={ type == 'Successful' ? [styles.optionTab, { backgroundColor: '#fff', }] :  [styles.optionTab] }>
              <Text style={styles.optionTabText}>Successful</Text>
            </Pressable>
            <Pressable onPress={() => setType('Declined')} style={ type == 'Declined' ? [styles.optionTab, { backgroundColor: '#fff', }] :  [styles.optionTab] }>
              <Text style={styles.optionTabText}>Declined</Text>
            </Pressable>
            <Pressable onPress={() => setType('Pending')} style={ type == 'Pending' ? [styles.optionTab, { backgroundColor: '#fff', }] :  [styles.optionTab] }>
              <Text style={styles.optionTabText}>Pending</Text>
            </Pressable>
          </View>

          <View style={styles.historyBody}>
            {
              type == 'All' &&
              <ScrollView style={{ width: '100%' }}>
                  {
                    transactionHistory.lenth > 0 
                    ?
                      <View style={styles.list}>
                          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: '#2DBB54' }}></View>
                          </View>
                          <View style={{ width: '70%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>Dollar Exchange</Text>
                            <Text style={styles.historyBodyText}>27/05/2021 8:05am</Text>
                          </View>
                          <View style={{ width: '20%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>N2,000.00</Text>
                            <Text style={[styles.historyBodyText, { color: '#2DBB54' }]}>Successful</Text>
                          </View>
                      </View> 
                    :
                    <Text style={[styles.historyBodyTitle, { alignSelf: 'center', marginTop: 100, }]}>No do not have any trnsaction record</Text>
                  }
              </ScrollView>}
            {
              type == 'Successful' &&
              <ScrollView style={{ width: '100%' }}>
                  {
                    transactionHistory.lenth > 0 
                    ?
                      <View style={styles.list}>
                          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: '#2DBB54' }}></View>
                          </View>
                          <View style={{ width: '70%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>Dollar Exchange</Text>
                            <Text style={styles.historyBodyText}>27/05/2021 8:05am</Text>
                          </View>
                          <View style={{ width: '20%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>N2,000.00</Text>
                            <Text style={[styles.historyBodyText, { color: '#2DBB54' }]}>Successful</Text>
                          </View>
                      </View> 
                    :
                    <Text style={[styles.historyBodyTitle, { alignSelf: 'center', marginTop: 100, }]}>No do not have any trnsaction record</Text>
                  }
              </ScrollView> 
            }
            {
              type == 'Declined' &&
              <ScrollView style={{ width: '100%' }}>
                  {
                    transactionHistory.lenth > 0 
                    ?
                      <View style={styles.list}>
                          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: '#2DBB54' }}></View>
                          </View>
                          <View style={{ width: '70%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>Dollar Exchange</Text>
                            <Text style={styles.historyBodyText}>27/05/2021 8:05am</Text>
                          </View>
                          <View style={{ width: '20%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>N2,000.00</Text>
                            <Text style={[styles.historyBodyText, { color: '#2DBB54' }]}>Successful</Text>
                          </View>
                      </View> 
                    :
                    <Text style={[styles.historyBodyTitle, { alignSelf: 'center', marginTop: 100, }]}>No do not have any trnsaction record</Text>
                  }
              </ScrollView>
            }
            {
              type == 'Pending' &&
              <ScrollView style={{ width: '100%' }}>
                  {
                    transactionHistory.lenth > 0 
                    ?
                      <View style={styles.list}>
                          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: '#2DBB54' }}></View>
                          </View>
                          <View style={{ width: '70%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>Dollar Exchange</Text>
                            <Text style={styles.historyBodyText}>27/05/2021 8:05am</Text>
                          </View>
                          <View style={{ width: '20%', justifyContent: 'center', }}>
                            <Text style={styles.historyBodyTitle}>N2,000.00</Text>
                            <Text style={[styles.historyBodyText, { color: '#2DBB54' }]}>Successful</Text>
                          </View>
                      </View> 
                    :
                    <Text style={[styles.historyBodyTitle, { alignSelf: 'center', marginTop: 100, }]}>No do not have any trnsaction record</Text>
                  }
              </ScrollView>
            }
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
    padding: 30,
    alignItems: 'center'
  }, 
  body:{
    width: '100%',
    marginTop: 50,
  },
  bodyH1:{
    fontSize: 25, 
    fontFamily: 'Helvetica-Bold',
  },
  bodyTop:{
    width: '100%',
    height: 30,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
    flexDirection: 'row',
    marginVertical: 20,
  },
  optionTab:{
    height: '100%',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius: 20,
  },
  optionTabText:{
    color: '#595C5B',
    fontSize : 13,
    fontFamily: 'Helvetica',
  },
  historyBody:{
    width: '100%',
    height: '80%',
    marginVertical: 10, 
  },
  list:{
    width: '100%',
    flexDirection: 'row',
    marginVertical: 5,
  },
  historyBodyTitle:{
    color: '#212222',
    fontSize : 14,
    fontFamily: 'Helvetica-Bold',
  },
  historyBodyText:{ 
    color: '#212222',
    fontSize : 12,
    fontFamily: 'Helvetica',
  },
  searchCon:{
    marginTop: '10%',
    width: '100%',
    height: '7%',
    backgroundColor: 'rgba(36, 57, 114, .2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5
  },
  input:{
    width: '80%',
    fontSize: 13,
    color: 'rgba(0, 0, 0, .5)',
    fontFamily: 'Helvetica',
    left: 5
  }
});